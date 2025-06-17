export class Helicoptero {
  id: number = 0;
  nombre: string = '';
  modelo: string = '';
  urlFoto: string = '';
  postedBy: {
    id: number;
    username: string;
  } | null = null;
  reaccionMasVotada?: string;
  comentarios?: { id: number; contenido: string; nombreUsuario: string }[] = [];
  nuevoComentario?: string = '';
}
