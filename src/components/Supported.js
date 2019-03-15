const supported = {
    elements : {
        'opt-Adam' : {id:'opt-Adam', content:'Adam'},
        'opt-RMSProp' : {id:'opt-RMSProp', content:'RMSProp'},
        'opt-Momentum' : {id:'opt-Momentum', content:'Momentum'},
        'reg-L1' : {id: 'reg-L1', content: 'L1'},
        'reg-L2' : {id: 'reg-L2', content: 'L2'},
        'mod-Linear' : {id : 'mod-Linear', content: 'Linear'}
    },
    columns :   {
        'col-opt' : {
            id  : 'col-opt',
            title : 'Optimizers',
            elementIds : ['opt-Adam','opt-RMSProp','opt-Momentum']
        },
        'col-reg' : {
            id : 'col-reg',
            title : 'Regularizations',
            elementIds : ['reg-L1', 'reg-L2']
        },
        'col-mod' : {
            id: 'col-mod',
            title : 'Models',
            elementIds : ['mod-Linear']
        }
    },
    columnOrder : ['col-mod', 'col-opt', 'col-reg']
}

export default supported;