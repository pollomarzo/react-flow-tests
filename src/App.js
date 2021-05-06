import React from 'react';
import LayoutFlow from './LayoutFlow';
import './style.css';

const annotatedText =
  '<b>Abstract</b>: The «Consolidated <annotation><annotation><span  class="link" data-topic="my:risk">risk</span></annotation></annotation> markers» are an external estimate of <annotation><annotation><span  class="link" data-topic="my:risk">the risk</span></annotation></annotation> that you might not pay back <annotation><annotation><span  class="link" data-topic="my:loan">the loan</span></annotation></annotation>. To <annotation><annotation><span  class="link" data-topic="my:customer">every customer</span></annotation></annotation> (included you) has been associated a value for the external <annotation><annotation><span  class="link" data-topic="my:risk">risk</span></annotation></annotation> estimate, and this value is used to compute <annotation><annotation><span  class="link" data-topic="my:fico_score">the FICO Score</span></annotation></annotation> and to <annotation><annotation><span  class="link" data-topic="my:decide">decide</span></annotation></annotation> whether to assign <annotation><annotation><span  class="link" data-topic="my:loan">the loan</span></annotation></annotation>.';
function uniqByDataTopic(a) {
  let seen = new Set();
  return a.filter(item => {
    let k = item.getAttribute('data-topic');
    return seen.has(k) ? false : seen.add(k);
  });
}

export default function App() {
  var parser = new DOMParser();
  // parse String into HTML
  var htmlDoc = parser.parseFromString(annotatedText, 'text/html');

  // get annotations
  const annotationList = [...htmlDoc.getElementsByTagName('annotation')];
  // get spans (all info is in span, ignore the nested annotation)
  const spanList = annotationList.map(elem =>
    elem.getElementsByTagName('span').item(0)
  );
  const cleanSpanList = uniqByDataTopic(spanList);

  // convert to better format
  var nodes = cleanSpanList.map((it, idx) => ({
    id: idx,
    data: { label: it.innerText },
    dataTopic: it.getAttribute('data-topic'),
    position: { x: 0, y: 0 }
  }));

  const onConnect = params =>
    setElements(els =>
      addEdge({ ...params, type: 'smoothstep', animated: true }, els)
    );
  const onElementsRemove = elementsToRemove =>
    setElements(els => removeElements(elementsToRemove, els));

  return (
    <div>
      <h1>Hello!</h1>
      <div style={{ height: 300 }}>
        <LayoutFlow initialElements={nodes} 
        onConnect onElementsRemove />
      </div>
    </div>
  );
}
