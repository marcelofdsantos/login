import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

// Services
import { ChecklistService } from '../../services/checklist.service';
import { EmpilhadeiraService } from '../../services/empilhadeira.service';
import { AuthService } from '../../services/auth.service';

// Models
import {
  ChecklistRequest,
  ItemChecklistRequest,
  EmpilhadeiraResponse,
  TipoItem,
  StatusItem,
  Turno
} from '../../models/api.models';

@Component({
  selector: 'app-checklist',
  standalone: true,
  templateUrl: './checklist.html',
  styleUrls: ['./checklist.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    MatDividerModule
  ]
})
export class Checklist implements OnInit {

  form!: FormGroup;
  carregando = false;
  salvando = false;
  
  empilhadeirasDisponiveis: EmpilhadeiraResponse[] = [];
  nomeOperador = '';
  reOperador = '';

  // Arrays de itens
  itensConformes = [
    'Gotejamento',
    'Pneus dianteiro',
    'Pneus traseiro',
    'Garfos',
    'Limpeza'
  ];

  itensImpeditivos = [
    'Direção',
    'Cinto de segurança',
    'Extintor de incêndio',
    'Buzina',
    'Vazamento',
    'Freio pedal',
    'Freio de estacionário',
    'Espelho retrovisor',
    'Sirene de ré',
    'Iluminação ou sinalização',
    'Pinos da patola',
    'Painel ou alavancas inoperante',
    'Giroflex',
    'Fixação do cilindro de GLP ineficiente',
    'Nível do óleo do motor',
    'Água do radiador'
  ];

  turnos = [
    { value: Turno.A, label: 'Turno A - Manhã' },
    { value: Turno.B, label: 'Turno B - Tarde' },
    { value: Turno.C, label: 'Turno C - Noite' }
  ];

  constructor(
    private fb: FormBuilder,
    private checklistService: ChecklistService,
    private empilhadeiraService: EmpilhadeiraService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarDadosUsuario();
    this.carregarEmpilhadeiras();
    this.inicializarFormulario();
  }

  carregarDadosUsuario(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.nomeOperador = user.nomeCompleto;
      this.reOperador = user.re;
    }
  }

  carregarEmpilhadeiras(): void {
    this.carregando = true;
    this.empilhadeiraService.listarDisponiveis().subscribe({
      next: (empilhadeiras) => {
        this.empilhadeirasDisponiveis = empilhadeiras;
        this.carregando = false;
      },
      error: (error) => {
        console.error('Erro ao carregar empilhadeiras:', error);
        this.snackBar.open('❌ Erro ao carregar empilhadeiras', 'Fechar', { duration: 3000 });
        this.carregando = false;
      }
    });
  }

  inicializarFormulario(): void {
    const now = new Date();
    const dataFormatada = now.toISOString().split('T')[0];
    const horaFormatada = now.toTimeString().split(' ')[0];

    this.form = this.fb.group({
      // Empilhadeira
      empilhadeiraId: ['', Validators.required],

      // Dados da Vistoria
      data: [dataFormatada, Validators.required],
      horaVistoria: [horaFormatada, Validators.required],
      turno: [Turno.A, Validators.required],
      horimetroInicial: ['', [Validators.required, Validators.min(0)]],
      horimetroFinal: ['', Validators.min(0)],
      observacaoGeral: [''],

      // Itens
      conformes: this.fb.array([]),
      impeditivos: this.fb.array([])
    });

    this.criarItens();
  }

  criarItens(): void {
    this.itensConformes.forEach(nome =>
      this.conformes.push(this.criarItem(nome, TipoItem.CONFORME))
    );

    this.itensImpeditivos.forEach(nome =>
      this.impeditivos.push(this.criarItem(nome, TipoItem.IMPEDITIVO))
    );
  }

  criarItem(nome: string, tipo: TipoItem): FormGroup {
    return this.fb.group({
      nome: [nome],
      tipo: [tipo],
      status: [StatusItem.OK],
      observacao: ['']
    });
  }

  get conformes(): FormArray {
    return this.form.get('conformes') as FormArray;
  }

  get impeditivos(): FormArray {
    return this.form.get('impeditivos') as FormArray;
  }

  existeImpeditivoNaoConforme(): boolean {
    return this.impeditivos.value.some(
      (item: any) => item.status === StatusItem.NAO_CONFORME
    );
  }

  logout(): void {
    this.authService.logout();
  }

  salvar(): void {
    if (this.form.invalid) {
      this.snackBar.open('⚠️ Preencha todos os campos obrigatórios', 'Fechar', { duration: 3000 });
      return;
    }

    const user = this.authService.getCurrentUser();
    if (!user) {
      this.snackBar.open('❌ Usuário não autenticado', 'Fechar', { duration: 3000 });
      this.router.navigate(['/login']);
      return;
    }

    // Verifica se há item impeditivo não conforme
    if (this.existeImpeditivoNaoConforme()) {
      const confirma = confirm(
        '⚠️ ATENÇÃO! Existem itens impeditivos não conformes.\n\n' +
        '🚫 A empilhadeira será BLOQUEADA automaticamente.\n\n' +
        'Deseja continuar?'
      );
      if (!confirma) return;
    }

    // Monta o request
    const itens: ItemChecklistRequest[] = [];
    
    // Adiciona itens conformes
    this.conformes.value.forEach((item: any) => {
      itens.push({
        descricao: item.nome,
        tipo: item.tipo,
        status: item.status,
        observacao: item.observacao || undefined
      });
    });

    // Adiciona itens impeditivos
    this.impeditivos.value.forEach((item: any) => {
      itens.push({
        descricao: item.nome,
        tipo: item.tipo,
        status: item.status,
        observacao: item.observacao || undefined
      });
    });

    const request: ChecklistRequest = {
      data: this.form.value.data,
      horaVistoria: this.form.value.horaVistoria,
      turno: this.form.value.turno,
      horimetroInicial: parseInt(this.form.value.horimetroInicial),
      horimetroFinal: this.form.value.horimetroFinal ? parseInt(this.form.value.horimetroFinal) : undefined,
      operadorId: user.usuarioId,
      empilhadeiraId: parseInt(this.form.value.empilhadeiraId),
      itens: itens,
      observacaoGeral: this.form.value.observacaoGeral || undefined
    };

    this.salvando = true;

    this.checklistService.criar(request).subscribe({
      next: (response) => {
        this.salvando = false;
        
        if (response.resultado === 'REPROVADO') {
          this.snackBar.open(
            '🚫 Checklist REPROVADO! Empilhadeira bloqueada automaticamente.',
            'Fechar',
            { duration: 5000 }
          );
        } else {
          this.snackBar.open(
            '✅ Checklist salvo com sucesso! Empilhadeira liberada.',
            'Fechar',
            { duration: 3000 }
          );
        }

        // Reseta o formulário
        this.form.reset();
        this.inicializarFormulario();
        this.carregarEmpilhadeiras();
      },
      error: (error) => {
        this.salvando = false;
        const mensagem = error.error?.message || 'Erro ao salvar checklist';
        this.snackBar.open(`❌ ${mensagem}`, 'Fechar', { duration: 5000 });
      }
    });
  }
}
