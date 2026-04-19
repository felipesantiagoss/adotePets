class AppManager {
  constructor() {
    this.keys = {
      pets: 'adotePets:pets',
      clinicas: 'adotePets:clinicas',
      historias: 'adotePets:historias',
      instituicoes: 'adotePets:instituicoes',
      usuario: 'adotePets:usuario'
    };
  }

  seedData() {
    if (!localStorage.getItem(this.keys.pets)) {
      const pets = [
        new Pet({ id: this.uid(), nome: 'Mel', especie: 'Cachorro', sexo: 'Fêmea', raca: 'SRD', porte: 'Médio', idade: '2 anos', peso: '12 kg', localizacao: 'Taguatinga, Brasília - DF', descricao: 'Dócil, brincalhona e ama crianças.', status: 'Disponível', imagem: 'img/pet-placeholder.svg', favorito: false }),
        new Pet({ id: this.uid(), nome: 'Nino', especie: 'Gato', sexo: 'Macho', raca: 'Siamês', porte: 'Pequeno', idade: '1 ano', peso: '4 kg', localizacao: 'Ceilândia, Brasília - DF', descricao: 'Calmo e muito carinhoso.', status: 'Disponível', imagem: 'img/pet-placeholder.svg', favorito: true }),
        new Pet({ id: this.uid(), nome: 'Luna', especie: 'Cachorro', sexo: 'Fêmea', raca: 'Vira-lata', porte: 'Grande', idade: '3 anos', peso: '20 kg', localizacao: 'Asa Norte, Brasília - DF', descricao: 'Muito ativa e protetora.', status: 'Em avaliação', imagem: 'img/pet-placeholder.svg', favorito: false })
      ];
      this.save(this.keys.pets, pets);
    }

    if (!localStorage.getItem(this.keys.clinicas)) {
      const clinicas = [
        new Clinica({ id: this.uid(), nome: 'Coração Peludinho', localizacao: 'Gama - DF', contato: '(61) 98765-4321', imagem: 'img/clinic-placeholder.svg' }),
        new Clinica({ id: this.uid(), nome: 'Vet Bem Cuidar', localizacao: 'Samambaia - DF', contato: '(61) 91454-5888', imagem: 'img/clinic-placeholder.svg' }),
        new Clinica({ id: this.uid(), nome: 'Pet Adote Clínica', localizacao: 'Paranoá - DF', contato: '(61) 91336-1677', imagem: 'img/clinic-placeholder.svg' })
      ];
      this.save(this.keys.clinicas, clinicas);
    }

    if (!localStorage.getItem(this.keys.historias)) {
      const historias = [
        new Historia({
          id: this.uid(),
          titulo: 'Mel, a alegria da casa',
          data: '16/06/2022',
          categoria: 'Adoção Responsável',
          resumo: 'De ruas frias a abraços quentes: a transformação da Mel.',
          texto: 'A Mel chegou tímida, mas em poucas semanas mostrou toda sua energia e carinho. Hoje ela é parte essencial da família e inspira todos com sua doçura.',
          imagem: 'img/pet-placeholder.svg'
        }),
        new Historia({
          id: this.uid(),
          titulo: 'Max encontrou um novo lar',
          data: '12/09/2024',
          categoria: 'Adoção Responsável',
          resumo: 'Uma jornada de cuidado que terminou em final feliz.',
          texto: 'Resgatado em situação difícil, Max recebeu cuidados e paciência. Com o apoio da comunidade, encontrou um lar seguro e amoroso.',
          imagem: 'img/pet-placeholder.svg'
        })
      ];
      this.save(this.keys.historias, historias);
    }
  }

  uid() {
    return `id-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  }

  save(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  load(key) {
    return JSON.parse(localStorage.getItem(key) || '[]');
  }

  getPets() { return this.load(this.keys.pets); }
  getClinicas() { return this.load(this.keys.clinicas); }
  getHistorias() { return this.load(this.keys.historias); }
  getInstituicoes() { return this.load(this.keys.instituicoes); }

  addPet(petData) {
    const pets = this.getPets();
    pets.push(new Pet({ ...petData, id: this.uid(), favorito: false }));
    this.save(this.keys.pets, pets);
  }

  updatePet(id, petData) {
    const pets = this.getPets().map((pet) => (pet.id === id ? { ...pet, ...petData } : pet));
    this.save(this.keys.pets, pets);
  }

  deletePet(id) {
    const pets = this.getPets().filter((pet) => pet.id !== id);
    this.save(this.keys.pets, pets);
  }

  toggleFavorito(id) {
    const pets = this.getPets().map((pet) => (pet.id === id ? { ...pet, favorito: !pet.favorito } : pet));
    this.save(this.keys.pets, pets);
  }

  filtrarPets(filtros) {
    return this.getPets().filter((pet) => {
      return Object.entries(filtros).every(([campo, valor]) => {
        if (!valor) return true;
        return String(pet[campo]).toLowerCase().includes(String(valor).toLowerCase());
      });
    });
  }

  addInstituicao(data) {
    const instituicoes = this.getInstituicoes();
    instituicoes.push(new Instituicao({ id: this.uid(), ...data }));
    this.save(this.keys.instituicoes, instituicoes);
  }

  setUsuarioLogado(usuario) {
    localStorage.setItem(this.keys.usuario, JSON.stringify(usuario));
  }

  getUsuarioLogado() {
    return JSON.parse(localStorage.getItem(this.keys.usuario) || 'null');
  }
}

window.AppManager = AppManager;
