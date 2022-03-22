export default function deleteNodeChildren(node) {
  while (node.childNodes.length > 0) {
    node.removeChild(node.firstChild);
  }
}
