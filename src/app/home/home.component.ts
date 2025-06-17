import { Component } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { HelicopteroService } from '../services/helicoptero.service';
import { Helicoptero } from '../models/helicopteros/Helicoptero';
import { HelicopteroReaction } from '../models/helicopteros/HelicopteroReaction';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  username: string = '';
  helicopteroNombre: string = '';
  helicopteroModelo: string = '';
  helicopteroUrl: string = '';
  helicopteros: Helicoptero[] = [];
  modoBusquedaActiva: boolean = false;

  paginaActual: number = 0;
  tamañoPagina: number = 10;
  totalPaginas: number = 0;


  constructor(
    private storageService: StorageService,
    private heliService: HelicopteroService
  ) {
    this.username = this.storageService.getSession('user');
    console.log('Usuario:', this.username);
    this.getHelicopteros();
  }

  getHelicopteros() {
    this.heliService.getHelicopteros(this.paginaActual, this.tamañoPagina).subscribe(res => {
      this.helicopteros = res.content;
      this.totalPaginas = res.totalPages;

      this.helicopteros.forEach((helicoptero) => {
        this.heliService.getReaccionMasVotada(helicoptero.id).subscribe({
          next: (reaccion) => (helicoptero.reaccionMasVotada = reaccion),
          error: () => (helicoptero.reaccionMasVotada = 'Sin votos')
        });

        this.cargarComentarios(helicoptero);
      });
    });
  }
 terminoBusqueda: string = '';
 buscarHelicopteros() {
    if (!this.terminoBusqueda || this.terminoBusqueda.trim() === '') {
      this.limpiarBusqueda();
      return;
    }

    this.modoBusquedaActiva = true;
 this.heliService.buscarHelicopteros(this.terminoBusqueda).subscribe({
      next: (res: any) => {
        this.helicopteros = res;
        this.totalPaginas = 1;
        this.paginaActual = 0;

        this.helicopteros.forEach((helicoptero) => {
          this.heliService.getReaccionMasVotada(helicoptero.id).subscribe({
            next: (reaccion) => (helicoptero.reaccionMasVotada = reaccion),
            error: () => (helicoptero.reaccionMasVotada = 'Sin votos')
          });

          this.cargarComentarios(helicoptero);
        });
      },
      error: (err) => console.error('Error al buscar canciones:', err)
    });
  }

  limpiarBusqueda() {
    this.terminoBusqueda = '';
    this.modoBusquedaActiva = false;
    this.getHelicopteros();
  }

  addHelicoptero() {
      if (
    !this.helicopteroNombre.trim() ||
    !this.helicopteroModelo.trim() ||
    !this.helicopteroUrl.trim()
  ) {
    alert('Todos los campos son obligatorios.');
    return;
  }

  // Validación simple de URL
  if (!this.helicopteroUrl.startsWith('http')) {
    alert('La URL debe comenzar con http o https.');
    return;
  }
    const nuevo: Helicoptero = {
      id: 0,
      nombre: this.helicopteroNombre,
      modelo: this.helicopteroModelo,
      urlFoto: this.helicopteroUrl,
      postedBy: null
    };

    console.log('Helicoptero agregada:', nuevo);
     this.heliService.postHelicoptero(nuevo).subscribe({
    next: (respuesta: any) => {
      console.log('✅ Helicóptero agregado:', respuesta);
      this.getHelicopteros();
      this.helicopteroNombre = '';
      this.helicopteroModelo = '';
      this.helicopteroUrl = '';
    },
    error: (err) => {
      console.error('❌ Error al agregar helicóptero:', err);
      alert('Error al guardar. Verifica tus datos o tu sesión.');
    }
  });
  }


  reaccionar(helicopteroId: number, reactionId: number) {
      const reaccion: HelicopteroReaction = {
      helicopteroId: helicopteroId,
      reactionId: reactionId,
    };

    this.heliService.postReaccion(reaccion).subscribe({
      next: (res) => {
        console.log('Reacción enviada:', res);
        this.getHelicopteros(); // recargar para ver la reacción más votada actualizada
      },
      error: (err) => {
        console.error('Error al enviar reacción:', err);
      }
    });
  }

  cargarComentarios(helicoptero: Helicoptero) {
      this.heliService.getComentariosPorHelicoptero(helicoptero.id).subscribe({
      next: (comentarios) => {
        helicoptero.comentarios = comentarios;
      },
      error: (err) => {
        console.error(`Error al cargar comentarios para la canción ${helicoptero.id}`, err);
      }
    });
  }

  crearComentario(helicoptero: Helicoptero) {
    if (!helicoptero.nuevoComentario || helicoptero.nuevoComentario.trim() === '') return;

    const comentario = {
      contenido: helicoptero.nuevoComentario,
      helicopteroId: helicoptero.id
    };

    this.heliService.postComentario(comentario).subscribe({
      next: () => {
        helicoptero.nuevoComentario = '';
        this.cargarComentarios(helicoptero);
      },
      error: (err) => {
        console.error('Error al crear comentario:', err);
      }
    });
  }

  public borrarHelicoptero(helicopteroId: number) {
    if (!confirm('¿Estás seguro de que deseas borrar esta Helicoptero?')) return;

    this.heliService.deleteHelicoptero(helicopteroId).subscribe({
      next: (res) => {
        console.log('Helicoptero eliminada:', res);
        this.getHelicopteros(); // recarga la lista
      },
      error: (err) => {
        console.error('Error al borrar el Helicoptero:', err);
      }
    });
  }
}


