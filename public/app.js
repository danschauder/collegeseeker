//Scale viewport

function isMobile() {
    var check = false;
    (function(a){
      if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) 
        check = true;
    })(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  };

function openModal() {
    document.getElementById("backdrop").style.display = "block"
    document.getElementById("mobileWarningModal").style.display = "block"
    document.getElementById("mobileWarningModal").className += "show"
}
function closeModal() {
    document.getElementById("backdrop").style.display = "none"
    document.getElementById("mobileWarningModal").style.display = "none"
    document.getElementById("mobileWarningModal").className += document.getElementById("mobileWarningModal").className.replace("show", "")
}
// Get the modal
const modal = document.getElementById('mobileWarningModal');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        closeModal()
    }
}

if (isMobile()){
    openModal();
} else {
    document.getElementById('loader').classList.add('is-active');
}

//instantiate a firestore instance
const db = firebase.firestore();

//Dynamically set the graph container's height property based on width
let canvas = document.getElementById('cy');
// const heightRatio = 0.5;
// canvas.style.height = (canvas.clientWidth * heightRatio).toString() + 'px';
canvas.style.height = (window.innerHeight-180).toString()+'px';

const infoTest=document.querySelector('#infoTest');
const infoTooltip=document.querySelector('#tooltip');
const repaymentPopup=document.querySelector('#repaymentPopup');
const repaymentTooltip=document.querySelector('#repaymentTooltip');

const popperInstance = Popper.createPopper(infoTest,infoTooltip,{
    placement: 'bottom',
    modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 8],
          },
        },
      ]
});

const repaymentPopper = Popper.createPopper(repaymentPopup,repaymentTooltip,{
    placement: 'bottom',
    modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 8],
          },
        },
      ]
});

function show() {
    infoTooltip.setAttribute('data-show', '');
  
    // We need to tell Popper to update the tooltip position
    // after we show the tooltip, otherwise it will be incorrect
    popperInstance.update();
}

function repaymentShow() {
    repaymentTooltip.setAttribute('data-show','');
    repaymentPopper.update();
}
  
function hide() {
    infoTooltip.removeAttribute('data-show');
}

function repaymentHide() {
    repaymentTooltip.removeAttribute('data-show');
}
  
const showEvents = ['mouseenter', 'focus'];
const hideEvents = ['mouseleave', 'blur'];
  
showEvents.forEach(event => {
    infoTest.addEventListener(event, show);
    repaymentPopup.addEventListener(event, repaymentShow);
});

hideEvents.forEach(event => {
    infoTest.addEventListener(event, hide);
    repaymentPopup.addEventListener(event, repaymentHide);
});



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
                "MDN_GRAD_DEBT": data["MDN_GRAD_DEBT"],
                PercentageDegreesAwarded: data.PercentageDegreesAwarded,
                State: data.State,
                state_name: data.state_name,
                UNITID: data.UNITID,
                control: data.control,
                in_state_tuition: data.in_state_tuition,
                locale: data.locale,
                out_state_tuition: data.out_state_tuition,
                region: data.region,
                // residential: data.residential,
                locale: data.locale,
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
const getEdges = (db, edgeConverter, edgeType='default_edges15') => {
    return new Promise((resolve, reject)=>{
        db.collection(edgeType)
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
        db.collection('nodesV2')
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
    let edges = data[1]

    // Define the default node as Georgia Tech
    // let currentNode = 183; //Georgia Tech
    // let currentNodeDetails = nodes[324].data
    const georgiaTech = nodes.filter(el=>el.data.School==='Georgia Institute of Technology-Main Campus')[0]
    let currentNode = georgiaTech.data.id
    let currentNodeDetails = georgiaTech.data
    let currentEdgeType = 'Balanced'

    const edgeLookup = {
        'Balanced':'default_edges15',
        'Campus Experience':'campus_experience_edges15',
        'Location':'location_edges15',
        'Selectivity':'selectivity_edges15'
    }

    const generateDescriptionText = (node) => {
        const nodeData = node.data();
        let url = node.data().url.toLowerCase();
        if (url.substring(0,4)!='http'){
            url = 'https://' + url
        }
        const descriptionText = `${nodeData.School} is a ${nodeData.control} institution in the state of ${nodeData.state_name}. It has a total undergraduate enrollment of ${nodeData.undergrad_size.toLocaleString()}, it's located in a ${nodeData.locale}, and the campus size is classified as a ${nodeData.size}. Its in-state tuition and fees are $${nodeData.in_state_tuition.toLocaleString()}; out-of-state tuition and fees are $${nodeData.out_state_tuition.toLocaleString()}. <br /><a target="_blank" href="${url}">Learn more at their website</a>`
        return descriptionText
    }

    // const storage = firebase.storage();
    // const storageRef = storage.ref();

    // const getLogoSVG = async (ele)=>{
    //     const s = await storageRef.child(`img/logo/${ele.data.UNITID}.jpg`).getDownloadURL().then(url=>url);
    //     console.log(s)
    //     return s
    // };
    // let logos={}

    //Define a function to populate the university name dropdown with college names and id's
    const populateUniversityDropdown = (nodes) => {
        const stateDropdown = document.getElementById("statePicker");
        const programDropdown = document.getElementById("programPicker")
        const priorityDropdown = document.getElementById("priorityPicker")
        let stateSet = new Set();
        let programSet = new Set();
        let universityList = [];
        let j=nodes.length-1
        nodes.forEach((el, i) => {
            stateSet.add(el.data.State)
            Object.keys(el.data.PercentageDegreesAwarded).forEach((el)=>{
                programSet.add(el)
            })
            // logos[el.data.UNITID]=getLogoSVG(el)
            universityList.push({id: el.data.id, School: el.data.School})
            if (i===j){
                let stateList = Array.from(stateSet)
                // let stateSelectBox = new vanillaSelectBox("#statePicker",{
                //     "maxHeight":200,
                //     "search":false
                // })
                let k=stateList.length-1
                stateList.sort().forEach((el, l)=>{
                    let stateOption = document.createElement("option");
                    stateOption.text = el;
                    stateOption.value = el;
                    stateDropdown.appendChild(stateOption)
                    if (l===k){
                        // document.multiselect('#statePicker').selectAll();
                        let stateSelectBox = new vanillaSelectBox("#statePicker",{
                            "maxHeight":200,
                            "placeHolder":"States",
                            "search":true
                            // "title":"State"
                        }).setValue('all');
                        // document.querySelector("#btn-group-#statePicker span.title").innerHTML="State"
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
                        // document.multiselect('#programPicker').selectAll();
                        let programSelectBox = new vanillaSelectBox("#programPicker",{
                            "maxHeight":200,
                            "placeHolder":"Programs",
                            "search":true
                            // "title":"State"
                        }).setValue('all');
                    }
                })

                const priorityList = ['Balanced','Campus Experience', 'Location', 'Selectivity'];
                priorityList.forEach((el,b)=>{
                    let priorityOption = document.createElement("option");
                    priorityOption.text=el;
                    priorityOption.value=el;
                    priorityDropdown.add(priorityOption)
                    if (b===3){
                        let prioritySelectBox = new vanillaSelectBox("#priorityPicker",{
                            "maxHeight":200,
                            "placeHolder":"Priority",
                            "search":false
                            // "title":"State"
                        }).setValue('Balanced');
                    }
                });


                
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
                    placeHolder: "Search for a college",
                    noResults: (dataFeedback, generateList) => {
                        // Generate autoComplete List
                        generateList(autoCompleteJS, dataFeedback, dataFeedback.results);
                        // No Results List Item
                        const result = document.createElement("li");
                        result.setAttribute("class", "no_result");
                        result.setAttribute("tabindex", "1");
                        result.innerHTML = `<span style="display: flex; align-items: center; font-weight: 100; color: white;">Found No Results for "${dataFeedback.query}"</span>`;
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

    const getSVG= (ele) => {
        const s = `https://firebasestorage.googleapis.com/v0/b/dvaspring2021madss.appspot.com/o/img%2Flogo%2F${ele.data().UNITID}.jpg?alt=media`
        const w = ele.data()['5YearRepaymentRate']*100
        const h = w
        return { svg: s, width: w, height: h };
    }

    // IMPORTANT FUNCTION
    // Given a node id, filters the nodes and edges within the node's neighborhood
    const getNeighborhoodData = (id, nodes, edges) => {
        const edgeSubset = edges.filter((el,i)=>{
            return (el.data.source==id || el.data.target==id)
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

    const updateGraphData = (selectedPriority) => {        
        const edgeType = edgeLookup[selectedPriority];
        currentEdgeType=selectedPriority;
        document.getElementById('loader').classList.add('is-active');
        getEdges(db,edgeConverter,edgeType).then((data)=>{
            edges=data;
            collegePickerHandler(currentNode);
        })
    }

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
                    // 'label': 'data(School)',
                    // 'width': 'data("5YearRepaymentRate")*50',
                    // 'height': 'data("5YearRepaymentRate")*50',
                    'font-size': '12px',
                    // 'background-image': 'img/gt.gif'
                    'background-image': function(ele){ return getSVG(ele).svg; },
                    'width': function(ele){ return getSVG(ele).width; },
                    'height': function(ele){ return getSVG(ele).height; }
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

    document.getElementById('loader').classList.remove('is-active');

    cy.dblclick();

    const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    })

    // console.log(generateDescriptionText(cy.getElementById(currentNode)))
    document.getElementById('selectedUniversityName').innerHTML=currentNodeDetails.School
    document.getElementById('selectedUniversityDetails').innerHTML=generateDescriptionText(cy.getElementById(currentNode))
    document.getElementById('fiveYearSpan').innerHTML=`${(cy.getElementById(currentNode).data()["5YearRepaymentRate"]*100).toFixed(2)}%`
    document.getElementById('medianDebt').innerHTML=`${currencyFormatter.format(cy.getElementById(currentNode).data()["MDN_GRAD_DEBT"])}`
    document.getElementById('wordCloudElement').src=`https://firebasestorage.googleapis.com/v0/b/dvaspring2021madss.appspot.com/o/img%2Fwordcloud%2F${cy.getElementById(currentNode).data().UNITID}-WC.png?alt=media`

    // Define function to bind click events to the nodes
    const bindNodeEvents = (nodes,nodeData,edges) => {
        nodes.on('dblclick',function(e){
            // Update the current node id and class
            const expandNodeId = e.target.id();
            cy.getElementById(currentNode).removeClass('centerNode');
            currentNode = expandNodeId;
            cy.getElementById(currentNode).addClass('centerNode');
            document.getElementById('selectedUniversityDetails').innerHTML=generateDescriptionText(cy.getElementById(currentNode))
            document.getElementById('selectedUniversityName').innerHTML=cy.getElementById(currentNode).data().School
            document.getElementById('fiveYearSpan').innerHTML=`${(cy.getElementById(currentNode).data()["5YearRepaymentRate"]*100).toFixed(2)}%`
            document.getElementById('medianDebt').innerHTML=`${currencyFormatter.format(cy.getElementById(currentNode).data()["MDN_GRAD_DEBT"])}`
            document.getElementById('wordCloudElement').src=`https://firebasestorage.googleapis.com/v0/b/dvaspring2021madss.appspot.com/o/img%2Fwordcloud%2F${cy.getElementById(currentNode).data().UNITID}-WC.png?alt=media`

            if (cy.getElementById(currentNode).hasClass('expanded')){
                // If the clicked node has already been expanded
                // collapse its child nodes
                const currentNodePosition = cy.getElementById(currentNode).position()
                let neighbors = cy.getElementById(currentNode).neighborhood()
                neighbors = neighbors.filter((el)=>{
                    let degreeFilter=false;
                    if (el.is('node')){
                        if (el.degree()===1){
                            degreeFilter=true;
                        } else if (el.degree()==2){
                            const outgoer = el.outgoers('node');
                            const incomer = el.incomers('node');
                            if (outgoer.id()===incomer.id()){
                                degreeFilter=true;
                            }
                        }
                    }
                    return el.is('node') && !el.hasClass('expanded') && degreeFilter
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
                // cy.fit();
                let maxPos=0;
                cy.nodes().forEach((el)=>{
                    if (el.position().x>maxPos){
                        maxPos=el.position().x
                    }
                })
                const newCenter=maxPos+350;
                cy.getElementById(expandNodeId).animate({
                    'position': { 'x': newCenter,/*cy.getElementById(expandNodeId).position()['x']+400,*/
                                    'y':0
                                },
                    'complete': function(){
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
                                fit: true,
                                stop: () => {
                                    // console.log('stop callback firing')
                                    // cy.center(cy.getElementById(expandNodeId));
                                    cy.animate({
                                        // center: cy.getElementById(expandNodeId).neighborhood(),
                                    //     // pan: cy.getElementById(expandNodeId).position(),
                                        // panBy:{'x':150,'y':0},
                                        zoom: {
                                            level: 1.1,
                                            position: {'x': cy.getElementById(expandNodeId).position().x+50,
                                                        'y':0}
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
            }
        })

        nodes.on('click',function(e){
            // Update the current node id and class
            const expandNodeId = e.target.id();
            cy.getElementById(currentNode).removeClass('centerNode');
            currentNode = expandNodeId;
            cy.getElementById(currentNode).addClass('centerNode');
            document.getElementById('selectedUniversityDetails').innerHTML=generateDescriptionText(cy.getElementById(currentNode))
            document.getElementById('selectedUniversityName').innerHTML=cy.getElementById(currentNode).data().School
            document.getElementById('fiveYearSpan').innerHTML=`${(cy.getElementById(currentNode).data()["5YearRepaymentRate"]*100).toFixed(2)}%`
            document.getElementById('medianDebt').innerHTML=`${currencyFormatter.format(cy.getElementById(currentNode).data()["MDN_GRAD_DEBT"])}`
            document.getElementById('wordCloudElement').src=`https://firebasestorage.googleapis.com/v0/b/dvaspring2021madss.appspot.com/o/img%2Fwordcloud%2F${cy.getElementById(currentNode).data().UNITID}-WC.png?alt=media`
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
            document.getElementById('selectedUniversityName').innerHTML=cy.getElementById(currentNode).data().School
            document.getElementById('selectedUniversityDetails').innerHTML=generateDescriptionText(cy.getElementById(currentNode))
            document.getElementById('fiveYearSpan').innerHTML=`${(cy.getElementById(currentNode).data()["5YearRepaymentRate"]*100).toFixed(2)}%`
            document.getElementById('medianDebt').innerHTML=`${currencyFormatter.format(cy.getElementById(currentNode).data()["MDN_GRAD_DEBT"])}`
            document.getElementById('wordCloudElement').src=`https://firebasestorage.googleapis.com/v0/b/dvaspring2021madss.appspot.com/o/img%2Fwordcloud%2F${cy.getElementById(currentNode).data().UNITID}-WC.png?alt=media`
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
            document.getElementById('loader').classList.remove('is-active');
        });
    }

    const updateFiltersHandler = (event) => {
        const selectedPriorityOption = document.querySelector('#priorityPicker option:checked');
        const selectedPriority = selectedPriorityOption.value;
        if (selectedPriority!=currentEdgeType){
            updateGraphData(selectedPriority);
        } else {
            // currentNode = event.target.options[event.target.selectedIndex].value;
            const selectedStatesOptions = document.querySelectorAll('#statePicker option:checked');
            // console.log(document.getElementById('statePicker').value);
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