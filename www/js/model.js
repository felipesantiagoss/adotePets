class Pet {
  constructor({
    id,
    nome,
    especie,
    sexo,
    raca,
    porte,
    idade,
    peso,
    localizacao,
    descricao,
    status,
    imagem,
    favorito = false
  }) {
    this.id = id;
    this.nome = nome;
    this.especie = especie;
    this.sexo = sexo;
    this.raca = raca;
    this.porte = porte;
    this.idade = idade;
    this.peso = peso;
    this.localizacao = localizacao;
    this.descricao = descricao;
    this.status = status;
    this.imagem = imagem;
    this.favorito = favorito;
  }
}

class Clinica {
  constructor({ id, nome, localizacao, contato, imagem }) {
    this.id = id;
    this.nome = nome;
    this.localizacao = localizacao;
    this.contato = contato;
    this.imagem = imagem;
  }
}

class Historia {
  constructor({ id, titulo, data, categoria, resumo, texto, imagem }) {
    this.id = id;
    this.titulo = titulo;
    this.data = data;
    this.categoria = categoria;
    this.resumo = resumo;
    this.texto = texto;
    this.imagem = imagem;
  }
}

class Instituicao {
  constructor({ id, nome, email, telefone, cnpj, cidade, endereco }) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.telefone = telefone;
    this.cnpj = cnpj;
    this.cidade = cidade;
    this.endereco = endereco;
  }
}

window.Pet = Pet;
window.Clinica = Clinica;
window.Historia = Historia;
window.Instituicao = Instituicao;
