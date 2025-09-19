const produto = document.getElementById("produto");
const custo = document.getElementById("custo");
const margem = document.getElementById("margem");
const imposto = document.getElementById("imposto");
const frete = document.getElementById("frete");
const desconto = document.getElementById("desconto");
const btn = document.getElementById("calcular");
const resultado = document.getElementById("resultado");
const lista = document.getElementById("produtos-salvos");
const desbloquear = document.getElementById("desbloquear");

let produtosSalvos = JSON.parse(localStorage.getItem("produtos")) || [];
renderProdutos();

btn.addEventListener("click", () => {
  const nome = produto.value.trim();
  const valorCusto = parseFloat(custo.value);
  const valorMargem = parseFloat(margem.value);
  const valorImposto = parseFloat(imposto.value) || 0;
  const valorFrete = parseFloat(frete.value) || 0;
  const valorDesconto = parseFloat(desconto.value) || 0;

  if (!nome || !valorCusto || !valorMargem) {
    resultado.textContent = "Preencha nome, custo e margem!";
    return;
  }

  let preco = valorCusto * (1 + valorMargem / 100);
  preco += preco * (valorImposto / 100);
  preco += valorFrete;
  preco -= preco * (valorDesconto / 100);

  resultado.textContent = `Preço final: R$ ${preco.toFixed(2)}`;

  const novoProduto = { nome, custo: valorCusto, margem: valorMargem, imposto: valorImposto, frete: valorFrete, desconto: valorDesconto, preco };
  produtosSalvos.push(novoProduto);
  localStorage.setItem("produtos", JSON.stringify(produtosSalvos));
  renderProdutos();
});

function renderProdutos() {
  lista.innerHTML = "";
  produtosSalvos.forEach((p, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${p.nome} → R$ ${p.preco.toFixed(2)} (C:${p.custo} M:${p.margem}% I:${p.imposto}% F:${p.frete} D:${p.desconto}%)</span>
      <button onclick="apagarProduto(${index})">Apagar</button>
    `;
    lista.appendChild(li);
  });
}

function apagarProduto(index) {
  produtosSalvos.splice(index,1);
  localStorage.setItem("produtos", JSON.stringify(produtosSalvos));
  renderProdutos();
}

desbloquear.addEventListener("click", () => {
  alert("Premium desbloqueado! Tema automático ativo.");
  document.body.style.background = "#0FBCF9";
  document.querySelector(".container").style.background = "#1A1A1A";
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").then(() => {
    console.log("Service Worker registrado!");
  });
}