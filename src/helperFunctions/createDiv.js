export default function createDiv(classArray = '', innerText = '') {
  const node = document.createElement('div');

  if (Array.isArray(classArray)) {
    classArray.forEach((element) => {
      node.classList.add(element);
    });
  } else {
    node.classList.add(classArray);
  }

  node.innerText = innerText;

  return node;
}
