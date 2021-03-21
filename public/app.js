const app = document.getElementById('graphContainer');
const netv = new NetV({ 
    container: app,
    nodeLimit: 1e5,
    linkLimit:1e7,
    node: {
        style: { strokeWidth: 0 }
    },
    link: {
        style: { strokeWidth: 0.5 }
    }
});

// const data = NetV.Utils.transformGraphPosition(netv.loadDataset('patents'), 500, 400, 300);
// const colorMap = {
//     patent: { r: 102, g: 194, b: 165, a:1 },
//     inventor: { r: 252, g: 141, b: 98, a:1 },
//     assignee: { r: 141, g: 160, b: 203, a: 1}
// }
// const radius = (x) => {
//     const transformer = (n, k) => Math.max(3, k * n ** 0.5)
//     switch (x.type) {
//         case 'patent':
//             return transformer(x.numCitations, 0.15)
//         case 'inventor':
//             return transformer(x.numPatents, 0.3)
//         case 'assignee':
//             return transformer(x.numPatents, 0.1)
//     }
// }

const data = NetV.Utils.transformGraphPosition(netv.loadDataset('miserables'), 600, 370, 310);
const colorMap = {
    '0' : {r: 0, g:0, b:0 },
    '1' : {r: 250, g:250, b:110 },
    '2' : {r: 196, g:236, b:116 },
    '3' : {r: 146, g:220, b:126 },
    '4' : {r: 100, g:201, b:135 },
    '5' : {r: 57, g:180, b:142 },
    '6' : {r: 8, g:159, b:143 },
    '7' : {r: 0, g:137, b:138 },
    '8' : {r: 8, g:115, b:127 },
    '9' : {r: 33, g:93, b:110 },
    '10' : {r: 42, g:72, b:88 }
}
const radius = (x) => {
    const transformer = (n, k) => Math.max(3, k * n ** 0.5)
    return transformer(x.group * 100, 0.3)
    // switch (x.type) {
    //     case 'patent':
    //         return transformer(x.numCitations, 0.15)
    //     case 'inventor':
    //         return transformer(x.numPatents, 0.3)
    //     case 'assignee':
    //         return transformer(x.numPatents, 0.1)
    // }
}

data.nodes.forEach((node) => {
    const { r, g, b, a } = colorMap[node.group]
    // node.style.fill = { r: r / 255, g: g / 255, b: b / 255, a }
    node.style = { fill: { r: r / 255, g: g / 255, b: b / 255, a: 1 },
                    r: radius(node)}
    
    // node.style.r = radius(node)
    // console.log(node)
})
netv.data(data)
netv.draw()
// netv.data({
//     nodes: [
//         { id: 1, x: 100, y: 100 },
//         { id: 2, x: 200, y: 200 },
//         { id: 3, x: 300, y: 300 },
//         { id: 4, x: 400, y: 400 },
//         { id: 5, x: 500, y: 500 }
//       ],
//       links: [
//         { source: 1, target: 3 },
//         { source: 1, target: 2 },
//         { source: 2, target: 4 },
//         { source: 2, target: 5 }
//       ]
// });




// const request = new XMLHttpRequest();
// request.open("GET","./data/nodes.json", false);
// request.send(null);
// const jsonData = JSON.parse(request.responseText);