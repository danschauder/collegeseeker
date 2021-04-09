//instantiate a firestore instance
const db = firebase.firestore();

//Dynamically set the graph container's height property based on width
let canvas = document.getElementById('cy');
const heightRatio = 0.5;
canvas.style.height = (canvas.clientWidth * heightRatio).toString() + 'px';


// Converter function to conform firestore edge data to taxonomy needed for cytoscape
const edgeConverter = {
    fromFirestore: function(snapshot, options) {
        const data = snapshot.data(options);
        return ({
            data: {id: snapshot.id.toString(),
                    source: data.source.toString(),
                    target: data.target.toString(),
                    distance: data.distance}
        })
    }
}

// Converter function to conform firestore node data to taxonomy needed for cytoscape
const nodeConverter = {
    fromFirestore: function(snapshot, options) {
        const data = snapshot.data(options);
        return ({
            data: {id: snapshot.id.toString(),
                School: data.School,
                "5YearRepaymentRate": data["5YearRepaymentRate"],
                PercentageDegreesAwarded: data.PercentageDegreesAwarded,
                State: data.State,
                UNITID: data.UNITID,
                control: data.control,
                in_state_tuition: data.in_state_tuition,
                locale: data.locale,
                out_state_tuition: data.out_state_tuition,
                region: data.region,
                residential: data.residential,
                sat: data.sat,
                selectivity: data.selectivity,
                size: data.size,
                undergrad_size: data.undergrad_size,
                url: data.url    
            }
        })
    }
}

// Returns a Promise with all the edges data
const getEdges = (db, edgeConverter) => {
    return new Promise((resolve, reject)=>{
        db.collection('default_edges')
        .withConverter(edgeConverter)
        .get()
        .then((querySnapshot)=>{
            const edges = []
            j=querySnapshot.length
            querySnapshot.forEach((el,i)=>{
                edges.push(el.data())
                if (i===j) {
                    resolve (edges)
                }
            })
        })
    })
}

//Returns a promise with all the nodes data
const getNodes = (db, nodeConverter) => {
    return new Promise((resolve, reject)=>{
        db.collection('nodes')
        .withConverter(nodeConverter)
        .orderBy("School")
        .get()
        .then((querySnapshot)=>{
            const nodes = []
            j=querySnapshot.length
            querySnapshot.forEach((el,i)=>{
                nodes.push(el.data())
                if (i===j) {
                    resolve (nodes)
                }
            })
        })
    })
}

//Wait for the nodes and edges queries to complete, then proceed
Promise.all([getNodes(db,nodeConverter), getEdges(db,edgeConverter),]).then((data)=>{
    const nodes = data[0]
    const edges = data[1]

    // Define the default node as the first one in the query results
    let currentNode = nodes[0].data.id
    let currentNodeDetails = nodes[0].data
    document.getElementById('selectedUniversityName').innerHTML=currentNodeDetails.School

    const generateDescriptionText = (node) => {
        const nodeData = node.data();
        const descriptionText = `${nodeData.School} is a ${nodeData.control} institution. It has a total undergraduate enrollment of ${nodeData.undergrad_size}, its setting is ${nodeData.residential}, and the campus size is classified as a ${nodeData.size}. Its in-state tuition and fees are $${nodeData.in_state_tuition}; out-of-state tuition and fees are $${nodeData.out_state_tuition}. <a target="_blank" href="https://${nodeData.url}">Learn more at their website</a>`
        return descriptionText
    }


    //Define a function to populate the university name dropdown with college names and id's
    const populateUniversityDropdown = (nodes) => {
        const stateDropdown = document.getElementById("statePicker");
        const programDropdown = document.getElementById("programPicker")
        let stateSet = new Set();
        let programSet = new Set();
        let universityList = [];
        let j=nodes.length-1
        nodes.forEach((el, i) => {
            stateSet.add(el.data.State)
            Object.keys(el.data.PercentageDegreesAwarded).forEach((el)=>{
                programSet.add(el)
            })
            universityList.push({id: el.data.id, School: el.data.School})
            if (i===j){
                let stateList = Array.from(stateSet)
                let k=stateList.length-1
                stateList.sort().forEach((el, l)=>{
                    let stateOption = document.createElement("option");
                    stateOption.text = el;
                    stateOption.value = el;
                    stateDropdown.add(stateOption)
                    if (l===k){
                        document.multiselect('#statePicker').selectAll();
                    }
                })

                let programList = Array.from(programSet)
                let p=programList.length-1
                programList.sort().forEach((el, q)=>{
                    let programOption = document.createElement("option");
                    programOption.text = el
                    programOption.value = el;
                    programDropdown.add(programOption)
                    if (p===q){
                        document.multiselect('#programPicker').selectAll();
                    }
                })
                
                const autoCompleteJS = new autoComplete({
                    name: "universityAutoComplete",
                    data: {
                        src: universityList,
                        key: ["School"]
                    },
                    resultsList: {
                        container: source => {
                            source.setAttribute("id", "id");
                        },
                        destination: "#autoComplete",
                        position: "afterend",
                        element: "ul",
                        idName: "id",
                        className: "autoCompleteList"
                    },
                    maxResults: 2000,
                    placeHolder: "Search for a specific college",
                    noResults: (dataFeedback, generateList) => {
                        // Generate autoComplete List
                        generateList(autoCompleteJS, dataFeedback, dataFeedback.results);
                        // No Results List Item
                        const result = document.createElement("li");
                        result.setAttribute("class", "no_result");
                        result.setAttribute("tabindex", "1");
                        result.innerHTML = `<span style="display: flex; align-items: center; font-weight: 100; color: rgba(0,0,0,.2);">Found No Results for "${dataFeedback.query}"</span>`;
                        document.querySelector(`#${autoCompleteJS.resultsList.idName}`).appendChild(result);
                    },
                    onSelection: feedback => {             // Action script onSelection event | (Optional)
                        collegePickerHandler(feedback.selection.value.id);
                    }
                })

            }
        });
    }

    //populate the dropdown
    populateUniversityDropdown(nodes);

    // IMPORTANT FUNCTION
    // Given a node id, filters the nodes and edges within the node's neighborhood
    const getNeighborhoodData = (id, nodes, edges) => {
        const edgeSubset = edges.filter((el,i)=>{
            return (el.data.source===id || el.data.target==id)
        })
        let neighbor_ids = []
        edgeSubset.map((el,i)=>{
            if (el.data.source==id){
                neighbor_ids.push(el.data.target)
            } else if (el.data.target==id) {
                neighbor_ids.push(el.data.source)
            }
        });
    
        const nodeSubset = nodes.filter((el,i)=>{
            return (neighbor_ids.includes(el.data.id) || el.data.id==id)
        })
    
        return {
            nodes: nodeSubset,
            edges: edgeSubset
        }
    }

    const makeSvg = (ele)=>{
        const s = 'img/gt.gif'
        const w = ele.data()['5YearRepaymentRate']*100
        const h = w
        return { svg: s, width: w, height: h };
    };

    // Initialize the core cytoscape graph instance    
    const cy = cytoscape({
        container: document.getElementById('cy'),
        elements: getNeighborhoodData(currentNode,nodes,edges),
        layout: {
            name: 'fcose',
            animate: false
        },
        style: [
            {
                selector: 'node',
                style: {
                    'background-fit': "cover",
                    'border-color': '#000',
                    'border-width': 2,
                    'border-opacity': 0.5,
                    'label': 'data(School)',
                    // 'width': 'data("5YearRepaymentRate")*50',
                    // 'height': 'data("5YearRepaymentRate")*50',
                    'font-size': '12px',
                    // 'background-image': 'img/gt.gif'
                    'background-image': function(ele){ return makeSvg(ele).svg; },
                    'width': function(ele){ return makeSvg(ele).width; },
                    'height': function(ele){ return makeSvg(ele).height; }
                }
            },
            {
                selector: '.nodeHover',
                style: {
                    'border-color': 'green',
                    'border-width': 5
                }
            },
            {
                selector: '.centerNode',
                style: {
                    'border-color': 'blue'
                }
            },
            {
                selector: 'edge',
                style: {
                    'width': 3,
                    'line-color': '#ccc'
                    // 'target-arrow-color': '#ccc'
                    // 'target-arrow-shape': 'triangle',
                    // 'curve-style': 'bezier'
                }
            },
            {
                selector: '.hiddenNode',
                style: {
                    'display': 'none'
                }
            }
        ]
    });

    // console.log(generateDescriptionText(cy.getElementById(currentNode)))
    document.getElementById('selectedUniversityDetails').innerHTML=generateDescriptionText(cy.getElementById(currentNode))

    // Define function to bind click events to the nodes
    const bindNodeEvents = (nodes,nodeData,edges) => {
        nodes.on('click',function(e){
            // Update the current node id and class
            const expandNodeId = e.target.id();
            cy.getElementById(currentNode).removeClass('centerNode');
            currentNode = expandNodeId;
            cy.getElementById(currentNode).addClass('centerNode');
            document.getElementById('selectedUniversityDetails').innerHTML=generateDescriptionText(cy.getElementById(currentNode))
            document.getElementById('selectedUniversityName').innerHTML=cy.getElementById(currentNode).data().School

            if (cy.getElementById(currentNode).hasClass('expanded')){
                // If the clicked node has already been expanded
                // collapse its child nodes
                const currentNodePosition = cy.getElementById(currentNode).position()
                let neighbors = cy.getElementById(currentNode).neighborhood()
                neighbors = neighbors.filter((el)=>{
                    return el.is('node') && !el.hasClass('expanded')
                })
                neighbors.animate({
                    position: currentNodePosition,
                    duration: 2000,
                    complete: ()=>{
                        cy.remove(neighbors);
                        cy.getElementById(currentNode).removeClass('expanded')
                    }
                })
            } else {
                //If the node is not already expanded, get its neighborhood and expand it
                //Get data on the neighborhood of the clicked node
                const newDataPromise = new Promise((resolve, reject) => {
                    const newData = getNeighborhoodData(expandNodeId,nodeData,edges);
                    resolve(newData);
                })
        
                //Add the new neighborhood data to the cytoscape Graph class
                //trigger a pan/zoom animation to focus on the new neighborhood
                //bind click events to the new nodes that were added
                newDataPromise.then((newData)=>{
                    const fixedNodes = cy.nodes().map((el,i)=>{
                        return {
                            nodeId: el.id(),
                            position: {x: el.position().x,
                                        y: el.position().y}
                        }
                    })
                    const newNodes = cy.add(newData);
                    const layout = cy.layout(
                        {name:'fcose', 
                        animate:true,
                        animationDuration: 2000,
                        nodeSeparation:2000,
                        fixedNodeConstraint: fixedNodes,
                        nodeRepulsion: node => 8000,
                        nodeDimensionsIncludeLabels:true,
                        stop: () => {
                            // console.log('stop callback firing')
                            cy.animate({
                                center: cy.getElementById(expandNodeId),
                                zoom: {
                                    level: 1.5,
                                    position: cy.getElementById(expandNodeId).position()
                                    },
                                duration: 2000
                                })
                            bindNodeEvents(newNodes,nodeData,edges);
                            cy.getElementById(currentNode).addClass('expanded')
                            }
                        })
                    const selectedStatesOptions = document.querySelectorAll('#statePicker option:checked');
                    const selectedStates = Array.from(selectedStatesOptions).map(el => el.value);
                    const selectedProgramsOptions = document.querySelectorAll('#programPicker option:checked');
                    const selectedPrograms = Array.from(selectedProgramsOptions).map(el => el.value);
                    let showNodes = cy.filter((el)=>{
                        return filterNodeByState(el,selectedStates)
                    })
        
                    showNodes = showNodes.filter((el)=>{
                        return filterNodeByProgram(el,selectedPrograms)
                    })
        
                    showNodes.toggleClass('hiddenNode',false)
                    showNodes.absoluteComplement().toggleClass('hiddenNode',true)
                    layout.run();
                });
            }
        })
    
        nodes.on('mouseover', function(e){
            // cy.getElementById(e.target.id()).addClass('nodeHover');
            if (e.target.id()!=currentNode){
                cy.getElementById(e.target.id()).animate({
                    style: {
                        'border-color': 'green',
                        // 'border-width': 6
                    },
                    duration: 25,
                    easing: 'linear'
                })
            }
        })
    
        nodes.on('mouseout', function(e){
            // cy.getElementById(e.target.id()).addClass('nodeHover');
            if (e.target.id()!=currentNode){
                cy.getElementById(e.target.id()).animate({
                    style: {
                        'border-color': '#000',
                        // 'border-width': 3,
                    },
                    duration: 25,
                    easing: 'linear'
                })
            }
        })
    }
    
    //Execute the bind node events function
    bindNodeEvents(cy.nodes(), nodes, edges);

    //Assign a class to the currently "focused" node so it can be styled
    cy.getElementById(currentNode).addClass('centerNode').addClass('expanded');
    
    //Bind an event listener to the dropdown
    // document.addEventListener('input', function (event) {
    //     if (event.target.id==='collegePicker'){
    //         collegePickerHandler(event);
    //     }
    // }, false)

    //When the dropdown value changes, clear the graph and initialize
    //with the new target node's neighborhood


    const collegePickerHandler = (targetId) => {
        // currentNode = event.target.options[event.target.selectedIndex].value;

        // const selectedCollegeElement = document.getElementById('collegePicker')
        // currentNode = selectedCollegeElement.options[selectedCollegeElement.selectedIndex].value;
        currentNode = targetId
        cy.remove('node');
        const newDataPromise = new Promise((resolve, reject) => {
            const newData = getNeighborhoodData(currentNode, nodes, edges);
            resolve(newData);
        })
        newDataPromise.then((newData)=>{
            const newNodes = cy.add(newData)
            const selectedStatesOptions = document.querySelectorAll('#statePicker option:checked');
            const selectedStates = Array.from(selectedStatesOptions).map(el => el.value);
            const selectedProgramsOptions = document.querySelectorAll('#programPicker option:checked');
            const selectedPrograms = Array.from(selectedProgramsOptions).map(el => el.value);
            let showNodes = cy.filter((el)=>{
                return filterNodeByState(el,selectedStates)
            })

            showNodes = showNodes.filter((el)=>{
                return filterNodeByProgram(el,selectedPrograms)
            })

            showNodes.toggleClass('hiddenNode',false)
            showNodes.absoluteComplement().toggleClass('hiddenNode',true)
            cy.layout({name:'fcose'}).run();
            bindNodeEvents(newNodes, nodes, edges);
            cy.getElementById(currentNode).addClass('centerNode').addClass('expanded');

        });
    }

    const updateFiltersHandler = (event) => {
        // currentNode = event.target.options[event.target.selectedIndex].value;
        const selectedStatesOptions = document.querySelectorAll('#statePicker option:checked');
        const selectedStates = Array.from(selectedStatesOptions).map(el => el.value);
        const selectedProgramsOptions = document.querySelectorAll('#programPicker option:checked');
        const selectedPrograms = Array.from(selectedProgramsOptions).map(el => el.value);
        let showNodes = cy.filter((el)=>{
            return filterNodeByState(el,selectedStates)
        })

        showNodes = showNodes.filter((el)=>{
            return filterNodeByProgram(el,selectedPrograms)
        })

        showNodes.toggleClass('hiddenNode',false)
        showNodes.absoluteComplement().toggleClass('hiddenNode',true)
    }

    //Filter Nodes By State
    const filterNodeByState = (node, selectedStates)=>{
        return (true ? (!node.isNode() || selectedStates.includes(node.data().State)) : false)
        // })
    }

    //Filter Nodes By Program
    const filterNodeByProgram = (node, selectedPrograms)=>{
        let includeNode = false
        selectedPrograms.forEach((prg,i)=>{
            if (!node.isNode() || node.data().PercentageDegreesAwarded.hasOwnProperty(prg)){
                // console.log('good node')
                includeNode = true
            }
        })
        return includeNode  
    }

    //Bind an event listener to the update filters  button
    document.addEventListener('click', function (event) {
        if (event.target.id==='updateFiltersButton'){
            updateFiltersHandler(event);
            // console.log(document.getElementById('statePicker').value)
        }
    }, false)

})