const app = new Framework7({
  name: 'Adote Pets',
  el: '#app'
});

const manager = new AppManager();
let filtrosAtivos = {};

function init() {
  manager.seedData();
  bindTabs();
  bindPopups();
  bindForms();
  bindActions();
  renderAll();
}

function bindTabs() {
  document.querySelectorAll('.tab-link').forEach((tab) => {
    tab.addEventListener('click', (event) => {
      event.preventDefault();
      const alvo = tab.dataset.tab;
      document.querySelectorAll('.tab-link').forEach((item) => item.classList.remove('tab-link-active'));
      document.querySelectorAll('.app-section').forEach((secao) => secao.classList.remove('active'));
      tab.classList.add('tab-link-active');
      document.querySelector(`#${alvo}`).classList.add('active');
    });
  });

  document.querySelector('.go-pets').addEventListener('click', () => {
    document.querySelector('[data-tab="pets-section"]').click();
  });
}

function bindPopups() {
  const popupFiltro = app.popup.create({ el: '#popup-filtro' });
  const popupPetForm = app.popup.create({ el: '#popup-pet-form' });
  const popupPetDetalhe = app.popup.create({ el: '#popup-pet-detalhe' });
  const popupHistoriaDetalhe = app.popup.create({ el: '#popup-historia-detalhe' });
  const popupLogin = app.popup.create({ el: '#popup-login' });
  const popupInstituicao = app.popup.create({ el: '#popup-instituicao' });

  document.querySelector('#btn-filtro').addEventListener('click', () => popupFiltro.open());
  document.querySelector('#btn-novo-pet').addEventListener('click', () => openPetForm());
  document.querySelector('#open-login').addEventListener('click', () => popupLogin.open());
  document.querySelector('#fab-login').addEventListener('click', () => popupLogin.open());
  document.querySelector('#btn-cadastro-instituicao').addEventListener('click', () => popupInstituicao.open());

  window.popups = { popupPetForm, popupPetDetalhe, popupHistoriaDetalhe, popupLogin, popupInstituicao };
}

function bindForms() {
  document.querySelector('#form-filtro').addEventListener('submit', (event) => {
    event.preventDefault();
    const dados = new FormData(event.target);
    filtrosAtivos = Object.fromEntries(dados.entries());
    renderPets();
    app.popup.get('#popup-filtro').close();
  });

  document.querySelector('#btn-limpar-filtro').addEventListener('click', () => {
    filtrosAtivos = {};
    document.querySelector('#form-filtro').reset();
    renderPets();
  });

  document.querySelector('#form-pet').addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.target;
    const dados = Object.fromEntries(new FormData(form).entries());
    const id = dados.id;
    delete dados.id;

    if (!dados.imagem) dados.imagem = 'img/pet-placeholder.svg';

    if (id) {
      manager.updatePet(id, dados);
      app.dialog.alert('Pet atualizado com sucesso!');
    } else {
      manager.addPet(dados);
      app.dialog.alert('Pet cadastrado com sucesso!');
    }

    form.reset();
    window.popups.popupPetForm.close();
    renderPets();
  });

  document.querySelector('#form-login').addEventListener('submit', (event) => {
    event.preventDefault();
    const dados = Object.fromEntries(new FormData(event.target).entries());
    manager.setUsuarioLogado({ email: dados.email, perfil: 'adotante' });
    app.dialog.alert('Login local realizado (simulado).');
    window.popups.popupLogin.close();
    event.target.reset();
  });

  document.querySelector('#form-instituicao').addEventListener('submit', (event) => {
    event.preventDefault();
    const dados = Object.fromEntries(new FormData(event.target).entries());
    if (dados.senha !== dados.confirmarSenha) {
      app.dialog.alert('As senhas não coincidem.');
      return;
    }
    manager.addInstituicao(dados);
    app.dialog.alert('Instituição cadastrada com sucesso.');
    window.popups.popupInstituicao.close();
    event.target.reset();
  });
}

function bindActions() {
  document.querySelector('#lista-pets').addEventListener('click', handlePetAction);
  document.querySelector('#lista-favoritos').addEventListener('click', handlePetAction);
  document.querySelector('#lista-historias').addEventListener('click', handleHistoriaAction);
}

function handlePetAction(event) {
  const button = event.target.closest('button');
  if (!button) return;
  const { action, id } = button.dataset;
  if (!id) return;

  if (action === 'favoritar') {
    manager.toggleFavorito(id);
    renderPets();
  }
  if (action === 'detalhar') {
    openPetDetalhe(id);
  }
  if (action === 'editar') {
    openPetForm(id);
  }
  if (action === 'excluir') {
    app.dialog.confirm('Deseja excluir este pet?', () => {
      manager.deletePet(id);
      renderPets();
    });
  }
}

function handleHistoriaAction(event) {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.action === 'ler-historia') {
    openHistoriaDetalhe(button.dataset.id);
  }
}

function openPetForm(id = null) {
  const form = document.querySelector('#form-pet');
  const titulo = document.querySelector('#titulo-form-pet');
  form.reset();

  if (id) {
    const pet = manager.getPets().find((item) => item.id === id);
    if (!pet) return;
    Object.entries(pet).forEach(([campo, valor]) => {
      const input = form.querySelector(`[name="${campo}"]`);
      if (input) input.value = valor;
    });
    titulo.textContent = 'Editar pet';
  } else {
    titulo.textContent = 'Cadastrar pet';
  }

  window.popups.popupPetForm.open();
}

function openPetDetalhe(id) {
  const pet = manager.getPets().find((item) => item.id === id);
  if (!pet) return;

  const content = document.querySelector('#pet-detalhe-conteudo');
  content.innerHTML = `
    <div class="detail-block">
      <img src="${pet.imagem || 'img/pet-placeholder.svg'}" class="detail-cover" alt="${pet.nome}" />
      <h2>${pet.nome}</h2>
      <p><strong>${pet.especie}</strong> • ${pet.sexo} • ${pet.porte}</p>
      <p>Raça: ${pet.raca}</p>
      <p>Idade: ${pet.idade} | Peso: ${pet.peso}</p>
      <p>Localização: ${pet.localizacao}</p>
      <p>Status: ${pet.status}</p>
      <p>${pet.descricao}</p>
      <button class="button button-fill cta-btn">Quero adotar</button>
    </div>
  `;
  window.popups.popupPetDetalhe.open();
}

function openHistoriaDetalhe(id) {
  const historia = manager.getHistorias().find((item) => item.id === id);
  if (!historia) return;

  const content = document.querySelector('#historia-detalhe-conteudo');
  content.innerHTML = `
    <div class="detail-block">
      <img src="${historia.imagem}" class="detail-cover" alt="${historia.titulo}" />
      <h2>${historia.titulo}</h2>
      <p><strong>${historia.categoria}</strong> - ${historia.data}</p>
      <p>${historia.texto}</p>
    </div>
  `;
  window.popups.popupHistoriaDetalhe.open();
}

function renderPets() {
  const pets = Object.keys(filtrosAtivos).length ? manager.filtrarPets(filtrosAtivos) : manager.getPets();
  const favoritos = manager.getPets().filter((pet) => pet.favorito);

  document.querySelector('#lista-pets').innerHTML = pets.map((pet) => cardPet(pet)).join('') || '<div class="block">Nenhum pet encontrado.</div>';
  document.querySelector('#lista-favoritos').innerHTML = favoritos.map((pet) => cardPet(pet)).join('') || '<div class="block">Nenhum favorito ainda.</div>';
}

function renderHistorias() {
  const historias = manager.getHistorias();
  document.querySelector('#lista-historias').innerHTML = historias.map((historia) => `
    <div class="card story-card">
      <div class="card-header"><img class="card-img" src="${historia.imagem}" alt="${historia.titulo}" /></div>
      <div class="card-content card-content-padding">
        <div class="pet-meta">${historia.categoria} - ${historia.data}</div>
        <h3>${historia.titulo}</h3>
        <p>${historia.resumo}</p>
        <button class="button button-outline" data-action="ler-historia" data-id="${historia.id}">Leia mais</button>
      </div>
    </div>
  `).join('');
}

function renderClinicas() {
  const clinicas = manager.getClinicas();
  document.querySelector('#lista-clinicas').innerHTML = clinicas.map((clinica) => `
    <div class="card clinic-card">
      <div class="card-header"><img class="card-img" src="${clinica.imagem}" alt="${clinica.nome}" /></div>
      <div class="card-content card-content-padding">
        <h3>${clinica.nome}</h3>
        <p><strong>Local:</strong> ${clinica.localizacao}</p>
        <p><strong>Contato:</strong> ${clinica.contato}</p>
      </div>
    </div>
  `).join('');
}

function cardPet(pet) {
  return `
    <div class="card pet-card">
      <div class="card-header"><img class="card-img" src="${pet.imagem || 'img/pet-placeholder.svg'}" alt="${pet.nome}" /></div>
      <div class="card-content card-content-padding">
        <div class="pet-meta">${pet.sexo} • ${pet.especie} • ${pet.porte}</div>
        <h3>${pet.nome}</h3>
        <p>${pet.idade} | ${pet.raca}</p>
        <p>${pet.localizacao}</p>
        <p><strong>Status:</strong> ${pet.status}</p>
        <div class="pet-actions">
          <button class="button button-small button-outline ${pet.favorito ? 'favorite-btn active' : 'favorite-btn'}" data-action="favoritar" data-id="${pet.id}">${pet.favorito ? 'Desfavoritar' : 'Favoritar'}</button>
          <button class="button button-small button-outline" data-action="detalhar" data-id="${pet.id}">Detalhes</button>
          <button class="button button-small" data-action="editar" data-id="${pet.id}">Editar</button>
          <button class="button button-small button-outline color-red" data-action="excluir" data-id="${pet.id}">Excluir</button>
        </div>
      </div>
      <div class="card-footer"><button class="button button-fill cta-btn" data-action="detalhar" data-id="${pet.id}">Quero adotar</button></div>
    </div>
  `;
}

function renderAll() {
  renderPets();
  renderHistorias();
  renderClinicas();
}

document.addEventListener('deviceready', init, false);
if (!window.cordova) {
  document.addEventListener('DOMContentLoaded', init);
}
