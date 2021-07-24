const livedWeeksColor = {
  stroke: '#27282d',
  fill: '#9c9c9c',
};
const currentWeeksColor = {
  stroke: '#3FC463',
  fill: '#3FC463',
};
const restWeeksColor = {
  stroke: '#27282d',
  fill: '#27282d',
};
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
  const remainingLife = dayOfDeath.getTime() - today.getTime();
  const livedWeeks = Math.ceil(livedLife / (7 * 24 * 60 * 60 * 1000));
  const remainingWeeks = Math.ceil(remainingLife / (7 * 24 * 60 * 60 * 1000));
  const totalWeeks = livedWeeks + remainingWeeks;
  return { totalWeeks, livedWeeks, remainingWeeks };
};

const generateLegent = () => {
  const legend = document.querySelector("#legend");
  if (legend) {
    // Remaining weeks
    const svgContainter = createSVGNode("svg", { width: 320, height: 15 });
    const gRemaining = createSVGNode("g", { width: 50, height: 15 }); 
    const remaining = createSVGNode("rect", { x: 0, y: 0, width: 15, height: 15, stroke: restWeeksColor.stroke, fill: restWeeksColor.fill});
    const remainingText = createSVGNode("text", { x: 20, y: 12.5, width: 15, height: 15, stroke: '#fff', fill: '#fff', fontSize: '0.8rem' });
    remainingText.innerHTML = 'Remaining weeks';
    gRemaining.appendChild(remaining);
    gRemaining.appendChild(remainingText);

    // Lived weeks
    const gLived = createSVGNode("g", { width: 50, height: 15 }); 
    const lived = createSVGNode("rect", { x: 130, y: 0, width: 15, height: 15, stroke: livedWeeksColor.stroke, fill: livedWeeksColor.fill });
    const livedText = createSVGNode("text", { x: 150, y: 12.5, width: 15, height: 15, stroke: '#fff', fill: '#fff', fontSize: '0.8rem' });
    livedText.innerHTML = 'Lived weeks';
    gLived.appendChild(lived);
    gLived.appendChild(livedText);

    // Current week
    const gCurrent = createSVGNode("g", { width: 50, height: 15 }); 
    const current = createSVGNode("rect", { x: 230, y: 0, width: 15, height: 15, stroke: currentWeeksColor.stroke, fill: currentWeeksColor.fill});
    const currentText = createSVGNode("text", { x: 250, y: 12.5, width: 15, height: 15, stroke: '#fff', fill: '#fff', fontSize: '0.8rem' });
    currentText.innerHTML = 'This week';
    gCurrent.appendChild(current);
    gCurrent.appendChild(currentText);

    const fragment = document.createDocumentFragment();
    fragment.appendChild(gRemaining);
    fragment.appendChild(gLived);
    fragment.appendChild(gCurrent);
    svgContainter.appendChild(fragment);
    legend.appendChild(svgContainter);
  }
};

const render = (birthDay: string, root: HTMLElement | null) => {
  const blockSize = 5;
  const rowSize = 52;
  const { totalWeeks, livedWeeks, remainingWeeks } = caculate(birthDay);
  const infoArea = document.querySelector("#info");
  if (infoArea) {
    infoArea.innerHTML = `
      You have lived <strong>${livedWeeks}</strong> weeks, <strong>${remainingWeeks}</strong> left until you are 85.
    `;
    generateLegent();
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
  const weekSvg = document.querySelector("#weeks svg");
  const legentSvg = document.querySelector("#legend svg");
  weekSvg?.remove();
  legentSvg?.remove();
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
