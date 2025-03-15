// Declaração de variáveis originais
let inputs = [];
let atributos = ["Força", "Vigor", "Inteligência", "Presença", "Magia"];
let pontosDistribuir = 11;
let pontos = [0, 0, 0, 0, 0]; // Valores iniciais dos atributos
let circulos = []; // Armazena posições dos círculos
let resetButton; // Botão de reset
let salvarButton; // Botão de salvar ficha
let classeSelect; // Caixa de seleção para a classe
let classeDescricao; // Texto para a descrição da classe

// Variáveis para HP, Sanidade e Esforço
let hp = 20;
let sanidade = 10;
let esforco = 5;

let imagemUrlInput; // Caixa de texto para o URL da imagem
let verificarImagemButton; // Botão "Verificar Imagem"
let imagemDisplay; // Exibindo a imagem ao lado direito

// Variável global para armazenar a URL da foto, se definida
let fotoUrl = "";

// Lista de 10 perícias com seus inputs
let pericias = [
  "Atletismo",
  "Ocultismo",
  "Percepção",
  "Persuasão",
  "Medicina",
  "Programação",
  "Liderança",
  "Engenharia",
  "Investigação",
  "Furtividade"
];
let periciasInputs = [];

function limitarPericias() {
  let total = 0;
  // Calcula o total atual de pontos gastos nas perícias
  for (let i = 0; i < periciasInputs.length; i++) {
    let value = parseInt(periciasInputs[i].value());
    if (isNaN(value)) value = 0;
    total += value;
  }
  
  // Valor do input que disparou o evento
  let currentValue = parseInt(this.value());
  if (isNaN(currentValue)) currentValue = 0;
  
  // Impede valores menores que 0 e maiores que 5
  if (currentValue < 0) {
    currentValue = 0;
    this.value(currentValue);
  }
  if (currentValue > 5) {
    currentValue = 5;
    this.value(currentValue);
  }
  
  // Recalcula o total sem o valor atual
  let sumWithoutCurrent = total - currentValue;
  let allowed = 8 - sumWithoutCurrent;
  allowed = max(allowed, 0);
  
  if (currentValue > allowed) {
    this.value(allowed);
    alert("Você excedeu o total de pontos disponíveis. Cada perícia tem limite de 5 pontos e o total para distribuir é 8.");
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Cria os campos de entrada
  criarCamposDeEntrada();
  
  // Define as posições dos círculos (atributos) de forma semelhante a um pentágono
  let centroX = width / 2 + 150;  
  let centroY = 250;  
  let raio = 150;
  
  circulos = [];
  for (let i = 0; i < atributos.length; i++) {
    let angle = TWO_PI / 5 * i - PI / 2;
    let x = centroX + raio * cos(angle);
    let y = centroY + raio * sin(angle);
    // Atualizado o valor de r para 35 (metade de 70) para refletir o novo diâmetro
    circulos.push({ x: x, y: y, r: 35 });
  }
  
  // Caixa de seleção para a classe
  classeSelect = createSelect();
  classeSelect.position(50, 180);
  classeSelect.size(250, 30);
  classeSelect.option('Nenhuma classe');
  classeSelect.option('Sábio');
  classeSelect.option('Velocista');
  classeSelect.option('Fisiculturista');
  classeSelect.option('Tagarela');
  classeSelect.option('Especialista');
  classeSelect.changed(atualizarDescricaoClasse);
  
  // Área para a descrição da classe
  classeDescricao = createDiv('Não aumenta nada');
  classeDescricao.position(50, 220);
  classeDescricao.style('color', '#fff');
  classeDescricao.style('font-size', '12px');

  // Botão de reset
  resetButton = createButton('Reset');
  resetButton.position(centroX - 65, centroY + 20);
  resetButton.size(120, 30);
  resetButton.mousePressed(resetAtributos);
  
  // Botão Salvar ficha (posição na parte inferior da tela)
  salvarButton = createButton('Salvar ficha');
  salvarButton.position(50, height - 50);
  salvarButton.size(250, 30);
  salvarButton.mousePressed(salvarFicha);
  
  // Caixa de texto para o URL da imagem
  imagemUrlInput = createInput(''); 
  imagemUrlInput.position(50, 490);
  imagemUrlInput.size(250, 30);
  
  // Botão "Verificar Imagem"
  verificarImagemButton = createButton('Verificar Imagem');
  verificarImagemButton.position(50, 530);
  verificarImagemButton.size(250, 30);
  verificarImagemButton.mousePressed(exibirImagem);
  
  // Área para exibir a imagem
  imagemDisplay = createImg('','');
  imagemDisplay.position(350, 320);
  imagemDisplay.size(250, 250);
  
  // Criação dos campos para as 10 perícias (dispostos à direita)
  let periciaXStart = width - 300;
  let periciaYStart = 80;
  let rowSpacing = 50;
  
  for (let i = 0; i < pericias.length; i++) {
    let posX = periciaXStart;
    let posY = periciaYStart + i * rowSpacing;
    
    let label = createDiv(pericias[i]);
    label.position(posX, posY);
    label.style('color', '#fff');
    label.style('font-size', '14px');
    label.style('line-height', '30px');
    
    let input = createInput('0');
    input.position(posX + 150, posY);
    input.size(50, 30);
    input.attribute("type", "number");
    input.attribute("min", "0");
    input.attribute("max", "5");
    input.input(limitarPericias);
    periciasInputs.push(input);
  }
}

function criarCamposDeEntrada() {
  let campos = ["Nome", "Idade"];
  for (let i = 0; i < campos.length; i++) {
    let input = createInput("");
    input.position(50, 100 + i * 40);
    input.size(250, 30);
    input.style("background", "#fff");
    input.style("color", "#000");
    input.attribute("placeholder", campos[i]);
    if (campos[i] === "Idade") {
      input.attribute("type", "number");
      input.input(verificarIdade);
    }
    inputs.push(input);
  }
}

function verificarIdade() {
  let idade = this.value();
  if (isNaN(idade) || idade < 0) {
    this.value('');
  }
}

function draw() {
  // Limpa o canvas para que o fundo definido no CSS apareça
  clear();
  
  // Desenha os círculos dos atributos e seus textos
  for (let i = 0; i < atributos.length; i++) {
    let pos = circulos[i];
    
    fill(255);
    // Aumentado de 50 para 70 o diâmetro do círculo
    ellipse(pos.x, pos.y, 70, 70);
    
    // Os frames agora serão exibidos via elementos DOM posicionados via CSS.
    fill(0);
    textSize(16);
    textAlign(CENTER, CENTER);
    text(pontos[i], pos.x, pos.y);
    
    fill(255);
    textSize(12);
    textAlign(CENTER, CENTER);
    // Ajustado o deslocamento para posicionar o nome abaixo do círculo maior
    text(atributos[i], pos.x, pos.y + 40);
  }
  
  // Atualiza a posição dos elementos DOM dos frames para alinhar com os círculos
  for (let i = 0; i < circulos.length; i++) {
    let frameElement = select("#frame" + i);
    if (frameElement) {
      // Para elementos de 80px, deslocamos 40 para centralizar
      frameElement.position(circulos[i].x - 48, circulos[i].y - 42);
    }
  }
  
  // Título "Atributos"
  fill(255);
  textSize(24);
  textAlign(CENTER, CENTER);
  text("Atributos", width / 2 + 150, 250);
  
  // Atualiza valores de HP, Sanidade e Esforço
  hp = calcularHP();
  sanidade = calcularSanidade();
  esforco = calcularEsforco();
  
  desenharBarra("HP", hp, 50, 270, color(255, 0, 0), 10, 36);
  desenharBarra("Sanidade", sanidade, 50, 320, color(0, 0, 255), 5, 24);
  desenharBarra("Esforço", esforco, 50, 370, color(255, 255, 0), 3, 8);
  
  // Desenha o texto "Defesa" e o escudo
  fill(255);
  textSize(14);
  textAlign(CENTER, CENTER);
  text("Defesa", 70, 410);
  let defesa = calcularDefesa();
  desenharEscudo(50, 420, defesa);
}

function desenharBarra(nome, valor, x, y, cor, min, max) {
  fill(255);
  textSize(14);
  textAlign(LEFT, CENTER);
  text(nome + ": " + nf(valor, 1, 0), x, y - 10);
  
  fill(cor);
  noStroke();
  rect(x, y, map(valor, min, max, 0, 250), 20);
}

function calcularHP() {
  let hpBase = 20;
  switch (classeSelect.value()) {
    case 'Sábio': hpBase -= 2; break;
    case 'Velocista': hpBase += 5; break;
    case 'Fisiculturista': hpBase += 7; break;
    case 'Tagarela': hpBase += 3; break;
    case 'Especialista': hpBase -= 3; break;
  }
  hpBase += pontos[0] * 2;
  hpBase += pontos[1] * 1;
  return constrain(hpBase, 10, 36);
}

function calcularSanidade() {
  let sanidadeBase = 10;
  switch (classeSelect.value()) {
    case 'Sábio': sanidadeBase += 5; break;
    case 'Velocista': sanidadeBase -= 1; break;
    case 'Fisiculturista': sanidadeBase -= 2; break;
    case 'Tagarela': sanidadeBase += 2; break;
    case 'Especialista': sanidadeBase += 3; break;
  }
  sanidadeBase += pontos[2] * 2;
  sanidadeBase += pontos[3] * 1;
  return constrain(sanidadeBase, 5, 24);
}

function calcularEsforco() {
  let esforcoBase = 5;
  switch (classeSelect.value()) {
    case 'Sábio': esforcoBase += 1; break;
    case 'Velocista': esforcoBase += 1; break;
    case 'Fisiculturista': esforcoBase += 1; break;
    case 'Tagarela': esforcoBase += 1; break;
    case 'Especialista': esforcoBase += 2; break;
  }
  if (pontos[4] >= 2) {
    esforcoBase += 1;
  }
  return constrain(esforcoBase, 3, 8);
}

function calcularDefesa() {
  let defesaBase = 10;
  switch (classeSelect.value()) {
    case 'Fisiculturista': defesaBase += 2; break;
    case 'Velocista': defesaBase += 1; break;
    case 'Tagarela': defesaBase -= 1; break;
    case 'Sábio': defesaBase -= 2; break;
  }
  defesaBase += pontos[1];
  return max(defesaBase, 0);
}

function mousePressed() {
  for (let i = 0; i < circulos.length; i++) {
    let d = dist(mouseX, mouseY, circulos[i].x, circulos[i].y);
    if (d < circulos[i].r) {
      let proximoValor = (pontos[i] + 1) % 4;
      let diferenca = proximoValor - pontos[i];
      if (pontosDistribuir - diferenca >= 0) {
        pontosDistribuir -= diferenca;
        pontos[i] = proximoValor;
      }
    }
  }
}

function resetAtributos() {
  pontosDistribuir = 11;
  pontos = [0, 0, 0, 0, 0];
  hp = 20;
  sanidade = 10;
  esforco = 5;
}

function desenharEscudo(x, y, defesa) {
  fill(200);
  stroke(173, 216, 230);
  strokeWeight(4);
  beginShape();
  vertex(x, y);
  vertex(x + 40, y);
  vertex(x + 50, y + 20);
  vertex(x + 20, y + 50);
  vertex(x - 10, y + 20);
  endShape(CLOSE);
  
  fill(0);
  noStroke();
  textSize(18);
  textAlign(CENTER, CENTER);
  text(defesa, x + 20, y + 20);
}

function atualizarDescricaoClasse() {
  switch (classeSelect.value()) {
    case 'Sábio': classeDescricao.html('Modifica principalmente HP e Sanidade.'); break;
    case 'Velocista': classeDescricao.html('Aumenta Agilidade e Esforço.'); break;
    case 'Fisiculturista': classeDescricao.html('Modifica Força e Defesa.'); break;
    case 'Tagarela': classeDescricao.html('Aumenta Inteligência e Sanidade.'); break;
    case 'Especialista': classeDescricao.html('Possui bônus em Magia e Defesa.'); break;
    default: classeDescricao.html('Não aumenta nada'); break;
  }
}

function exibirImagem() {
  let urlImagem = imagemUrlInput.value();
  fotoUrl = urlImagem;
  imagemDisplay.attribute('src', urlImagem);
  imagemUrlInput.remove();
  verificarImagemButton.remove();
}

function salvarFicha() {
  noLoop();
  
  // 1. Nome e Idade
  for (let i = 0; i < inputs.length; i++) {
    let pos = inputs[i].position();
    let val = inputs[i].value();
    fill(200);
    noStroke();
    rect(pos.x - 5, pos.y - 5, 260, 40, 5);
    fill(0);
    textSize(16);
    textAlign(LEFT, CENTER);
    text(val, pos.x, pos.y + 15);
    inputs[i].remove();
  }
  
  // 2. Classe (select)
  let posClasse = classeSelect.position();
  let valClasse = classeSelect.value();
  fill(200);
  noStroke();
  rect(posClasse.x - 5, posClasse.y - 5, 260, 40, 5);
  fill(0);
  textSize(16);
  textAlign(LEFT, CENTER);
  text(valClasse, posClasse.x, posClasse.y + 15);
  classeSelect.remove();
  
  // 3. Perícias (cada input)
  for (let i = 0; i < periciasInputs.length; i++) {
    let pos = periciasInputs[i].position();
    let val = periciasInputs[i].value();
    fill(200);
    noStroke();
    rect(pos.x - 5, pos.y - 5, 60, 40, 5);
    fill(0);
    textSize(16);
    textAlign(LEFT, CENTER);
    text(val, pos.x, pos.y + 15);
    periciasInputs[i].remove();
  }
  
  // 4. Imagem (se houver)
  if (fotoUrl) {
    loadImage(fotoUrl, function(img) {
      image(img, 350, 320, 250, 250);
      imagemDisplay.remove();
      salvarButton.remove();
      saveCanvas('ficha', 'png');
    });
  } else {
    imagemDisplay.remove();
    salvarButton.remove();
    saveCanvas('ficha', 'png');
  }
}
