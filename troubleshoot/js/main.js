window.addEventListener("load", init);

async function init() {
  const options = {
    headers: new Headers({
      "content-type": "text/html",
    }),
  };
  // "https://raw.githubusercontent.com/ecal-mid/guides/master/README.md";
  const url = noCacheURL("./README.md");
  const resp = await fetch(url, options);
  const checklistMarkdown = await resp.text();

  const mainContainer = document.createElement("section");
  mainContainer.id = "main-container";
  mainContainer.innerHTML = marked(checklistMarkdown);
  mainContainer
    .querySelectorAll('ul input[type="checkbox"]')
    .forEach(remapCheckBox);
  document.body.appendChild(mainContainer);

  document.querySelectorAll("a").forEach(fixHyperlink);

  addBackButton()
  // clickableHeading(document.querySelector("#main-container > h2"), "../");

  // clickableHeading(
  //   document.querySelector("#main-container > h1"),
  //   "javascript:window.location.href=window.location.href"
  // );
}

function addBackButton() {
  let isSubDirectory = window.location.pathname !== "/";
  if (isSubDirectory) {
    let elem = cloneTemplate(".prev-button");
    document.querySelector("#main-container > h1").appendChild(elem);
  }
}

function fixHyperlink(hyperLinkTag) {
  let regExp = /\(([^)]+)\)/;
  let href = regExp.exec(hyperLinkTag.href);
  if (href) {
    // detect if external link
    hyperLinkTag.target = "_blank";
    hyperLinkTag.rel = "external";
    hyperLinkTag.href = href[1];
  }
  return hyperLinkTag;
}

function noCacheURL(url) {
  return `${url}?dev=${Date.now()}`;
}

function remapCheckBox(checkbox, index) {
  const id = `checkbox-${index}`;
  const prt = checkbox.parentElement;
  const label = document.createElement("label");

  checkbox.disabled = false;
  checkbox.name = checkbox.id = id;

  label.setAttribute("for", id);
  label.tabIndex = index+1;
  const container = document.createElement("div");
  container.className = "item";
  container.append(...prt.childNodes);

  prt.appendChild(checkbox);

  const customCheckbox = cloneTemplate(".checkbox");
  label.appendChild(customCheckbox);
  label.appendChild(container);
  prt.appendChild(label);

  setCollapse(container);
}

function clickableHeading(elem, link) {
  let aTag = document.createElement("a");
  aTag.href = link;
  let children = elem.childNodes;
  aTag.append(...children);
  elem.appendChild(aTag);
  return aTag;
}

function setCollapse(container) {
  container.querySelectorAll(":scope>ul").forEach(function (ul) {
    let siblings = getPreviousSiblings(ul);

    let summary = document.createElement("summary");
    let details = document.createElement("details");
    ul.parentElement.insertBefore(details, ul);
    summary.append(...siblings);
    details.appendChild(summary);
    details.appendChild(ul);

    let prt = details.parentElement;
    prt.parentElement.insertBefore(details, prt);
    prt.remove();
  });
}

function cloneTemplate(selector, deep = false) {
  return document.querySelector(`#templates>${selector}`).cloneNode(true);
}

function getPreviousSiblings(elem, filter) {
  var sibs = [];
  while ((elem = elem.previousSibling)) {
    if (!filter || filter(elem)) sibs.unshift(elem);
  }
  return sibs;
}
