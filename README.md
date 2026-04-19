# Adote Pets (Cordova + Framework7)

MVP acadêmico mobile-first para adoção responsável de animais no Distrito Federal.

## Tecnologias
- Apache Cordova
- Framework7
- HTML5, CSS3 e JavaScript ES6+
- localStorage

## Funcionalidades
- Home com banner e atalhos
- Listagem mobile de pets
- CRUD de pets (cadastrar, listar, editar, excluir)
- Favoritar e desfavoritar pets
- Filtros em popup (sem sidebar)
- Detalhe do pet em popup
- Histórias de impacto com detalhe
- Clínicas de castração em cards
- Login local/simulado
- Cadastro local de instituição
- Seed local inicial no primeiro carregamento

## Estrutura
- `config.xml`
- `package.json`
- `www/index.html`
- `www/css/app.css`
- `www/js/model.js`
- `www/js/manager.js`
- `www/js/app.js`
- `www/img/`

## Como executar
```bash
npm install
npx cordova platform add browser
npx cordova run browser
```

## Observações
- Não existe backend real.
- A persistência é feita com localStorage.
- O foco foi simplicidade, clareza e apresentação didática.

## Integrantes
- Nome 1:
- Nome 2:
- Nome 3:
