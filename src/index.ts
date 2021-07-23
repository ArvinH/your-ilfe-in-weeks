const createSVGNode = (
  nodeType: string,
  attributes?: Record<string, string | number>
) => {
  const node = document.createElementNS("http://www.w3.org/2000/svg", nodeType);
  for (let attribute in attributes) {
    node.setAttributeNS(
      null,
      attribute.replace(/[A-Z]/g, (m, _p, _o, _s) => {
        return "-" + m.toLowerCase();
      }),
      attributes[attribute].toString()
    );
  }
  return node;
};

const caculate = (birthDay: string) => {
  const lifeExp = 85;
  const today = new Date();
  const [year, month, day] = birthDay.split("-");
  const dayOfBirth = new Date(birthDay);
  const dayOfDeath = new Date(+year + lifeExp, +month, +day);
  const livedLife = today.getTime() - dayOfBirth.getTime();
  const restOfLife = dayOfDeath.getTime() - today.getTime();
  const livedWeeks = Math.ceil(livedLife / (7 * 24 * 60 * 60 * 1000));
  const restOfWeeks = Math.ceil(restOfLife / (7 * 24 * 60 * 60 * 1000));
  const totalWeeks = livedWeeks + restOfWeeks;
  return { totalWeeks, livedWeeks, restOfWeeks };
};

const render = (birthDay: string, root: HTMLElement | null) => {
  const blockSize = 5;
  const rowSize = 30;
  const { totalWeeks, livedWeeks, restOfWeeks } = caculate(birthDay);
  const infoArea = document.querySelector("#info");
  if (infoArea) {
    infoArea.innerHTML = `
      You have lived <strong>${livedWeeks}</strong> weeks, <strong>${restOfWeeks}</strong> left until you are 85.
    `;
  }
  const fragment = document.createDocumentFragment();
  const svgContainter = createSVGNode("svg", {
    width: rowSize * blockSize,
    height: Math.ceil(totalWeeks / rowSize) * blockSize
  });

  for (let index = 0; index < totalWeeks; index++) {
    const rectOption = {
      x: (index % rowSize) * blockSize,
      y: Math.floor(index / rowSize) * blockSize,
      width: blockSize,
      height: blockSize,
      stroke: "#27282d",
      fill: "none"
    };
    if (index <= livedWeeks) {
      rectOption.stroke = index === livedWeeks ? "#3FC463" : "#27282d";
      rectOption.fill = index === livedWeeks ? "#3FC463" : "#9c9c9c";
    }
    const rect = createSVGNode("rect", rectOption);
    fragment.appendChild(rect);
  }

  svgContainter.appendChild(fragment);

  root?.appendChild(svgContainter);
};

const inputRef = <HTMLInputElement>(
  document.querySelector("#control-panel input")
);

const handler = () => {
  const svg = document.querySelector("svg");
  svg?.remove();
  const birthDay = inputRef?.value;
  birthDay && render(birthDay, document.getElementById("weeks"));
};
document.addEventListener("keydown", (e) => {
  if (13 == e.keyCode) {
      handler();
  }
}); 
const submitBtn = document.querySelector("#submitBtn");
submitBtn?.addEventListener("click", handler);
