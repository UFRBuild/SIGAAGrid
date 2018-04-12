# SIGAA Grid

Extensão capaz de gerenciar e otimizar o processo de matrícula do SIGAA

![Screenshot](https://i.imgur.com/1Mh42Vh.png)

## Descrição
**SIGAA Grid** é capaz de gerenciar e otimizar o processo de matrícula do SIGAA (Sistema de Gestão das Atividades Acadêmica). O app organiza os horários de aulas semanais em uma tabela com todos componentes selecionados, mostrando para o usuario informações sobre conflitos e quantidade de compomentes.  Além disso, o app prepara um painel contendo todas informações como turma, professor, horário e conflitos.

## Guia

* [Como Funciona](#como-funciona)
* [Instalação](#instalacao)
* [Requisitos](#requisitos)
* [Sobre](#sobre)
* [TODO](#todo)
* [Creditos](#creditos)

## Como Funciona
![Screenshot2](https://image.slidesharecdn.com/1sgsriq5taglzqptrm4t-signature-942389a42e619b391f3db97b5433b2bc2817b0440f869b7f9ee19ee06d54d490-poli-150121203338-conversion-gate02/95/introduction-to-chrome-extension-development-12-1024.jpg?cb=1421872591)

O SIGAA Grid inicialmente injeta código (content.js) na página do SIGAA (page-action), fazando um "hook"(gancho) em cada row (td) da tabela, onde contém as informações sobre a componente curricular. Dessa forma, é possível redirecionar os eventos(onClick) de cada checkboxes enviados pelo usuário e posteriomente tratar os dados usando javascript (popup.js). A API do chrome extension oferece  pleno suporte para comunicação em tempo de execução (chrome.runtime), sendo possível interagir com usuário e a o mesmo tempo validar os dados no background usando callbacks.

Estrutura de arquivo:

```
.
├── css
│   ├── bootstrap.min.css
│   ├── material.min.css
│   └── popup.css (estilo do popup.html)
├── dashboard.html
├── fonts
│   ├── fonts.woff2
│   ├── glyphicons-halflings-regular.eot
│   ├── glyphicons-halflings-regular.svg
│   ├── glyphicons-halflings-regular.ttf
│   └── glyphicons-halflings-regular.woff
├── img
│   ├── check.png
│   ├── icon128.png
│   ├── icon16.png
│   └── icon64.png
├── js
│   ├── background.js (envia id da tab page-action )
│   ├── bootstrap.js
│   ├── bootstrap.min.js
│   ├── content.js (hook row da tabela e comunicação com usuario )
│   ├── dashboard.js
│   ├── jquery-2.0.3.min.js
│   ├── jquery.min.js
│   ├── material.min.js
│   └── popup.js (recebe obj dict do content.js )
├── manifest.json
├── popup.html
└── README.md

```

## Instalação

- Clone este repositório ou faça o download como um arquivo ZIP.
- Extraia o conteúdo em seu diretório de trabalho preferido.
- Abra o seu navegador Google Chrome.
- Digite "chrome://extensions/" na barra de endereço.
- Certifique-se de que o "Modo de desenvolvedor" esteja marcado / ativado no canto superior direito.
- Clique em "Carregar extensão descompactada ...".
- Navegue até o diretório extraído e clique em "OK".


## Requisitos

- Período de matrícula
- Logado no SIGAA da UFRB
- Recomendado usar o código da componente
- Usuário precisa insirir o componente **prático** após do teórico.

## Sobre

O app é **opensource** (código aberto) e foi desenvolvido com intuito de tornar o processo de matrícula do **SIGAA** simples e sem "dor de cabeça" (os servidores já não ajudam). Além disso, o objetivo do desenvolvedor é mostrar que esses  recursos podem ser implementados facilmente no sistema (usando o sistema seria "moleza") e com isso melhorar a experiência do usuário com a aplicação.

Tecnologias usadas:

- [Chrome extension](https://developer.chrome.com/extensions)
- Javascript
- Font-end ([mdl-material](https://getmdl.io/started/index.html))


## TODO

Novos Recursos:

* Adicionar grade usando a table do menu principal do SIGAA, para funcionar depois da matrícula (OBS: a table do home não tem ID)
* Adicionar popup table widget dinamicamente (scroll)
* Indentificar se o componente é pratico via code
* Salvar as cores button (componentes) no storage do chrome (obj reload com mesma cores)
* Adicionar filtro no matches do manifest.js (limitar apenas no home e processo de matrícula)
* Adicionar mais informações de cada td no modo painel (tipo quantidade de alunos por tumas e etc...)

## Creditos

O app foi desenvolvido por **Marcos Bomfim** estudante do curso BCET (Bacharelado em Ciências Exatas e Tecnológicas) UFRB. Agradecimentos ao prof. **Guilherme Araújo**, pela colaboração e por fomentar a ideia, [**Marcos Silva**](https://github.com/mcilva) (estudante do BCET, dev Front-end) pelas dicas com css e html.
