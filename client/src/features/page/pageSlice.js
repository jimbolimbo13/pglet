import { createSlice } from '@reduxjs/toolkit'

let nextId = 0

const initialState = {
    "name": "test-1",
    "error": null,
    "controls": {
        "0": {
            "c": [
                "1"
            ],
            "i": "0",
            "p": "",
            "t": "page"
        },
        "1": {
            "c": [
                "2",
                "3"
            ],
            "i": "1",
            "p": "0",
            "t": "row"
        },
        "2": {
            "c": [
                "myTxt",
                "myBtn"
            ],
            "i": "2",
            "p": "1",
            "t": "col"
        },
        "3": {
            "c": [
                "5"
            ],
            "i": "3",
            "p": "1",
            "t": "col"
        },
        "myTxt": {
            "i": "myTxt",
            "p": "2",
            "t": "text",
            "text": "Hello, world!"
        },
        "5": {
            "i": "5",
            "p": "3",
            "t": "button",
            "text": "Click me!"
        },
        "myBtn": {
            "i": "myBtn",
            "p": "2",
            "t": "button",
            "text": "Cancel"
        }
    }
}

const pageSlice = createSlice({
    name: 'page',
    initialState: initialState,
    reducers: {
        registerWebClientSuccess(state, action) {
            state.loading = false;
            state.controls = action.payload;
        },
        registerWebClientError(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        createNode: {
            reducer(state, action) {
                const { nodeId, parentId } = action.payload
                state.controls[nodeId] = {
                    i: nodeId,
                    p: parentId,
                    t: 'Node',
                    c: [],
                    counter: 0,
                    expanded: true
                }
                return nodeId;
            },
            prepare(parentId) {
                return {
                    payload: {
                        parentId,
                        nodeId: `new_${nextId++}`
                    }
                }
            }
        },
        increment(state, action) {
            const node = state.controls[action.payload]
            node.counter++
        },
        toggleExpand(state, action) {
            const node = state.controls[action.payload]
            node.expanded = !node.expanded
        },
        addChild(state, action) {
            const { nodeId, childId } = action.payload
            const node = state.controls[nodeId]
            node.c.push(childId)
        },
        removeChild(state, action) {
            const { nodeId, childId } = action.payload
            const node = state.controls[nodeId]
            node.c = node.c.filter(id => id !== childId)
        },
        changeProps(state, action) {
            const { nodeId, newProps } = action.payload
            const node = state.controls[nodeId]
            Object.assign(node, newProps)
        },
        deleteNode(state, action) {
            const nodeId = action.payload
            const descendantIds = getAllDescendantIds(state.controls, nodeId)
            return deleteMany(state.controls, [nodeId, ...descendantIds])
        }
    }
})

const getAllDescendantIds = (controls, nodeId) => {
    if (controls[nodeId].c) {
        return controls[nodeId].c.reduce((acc, childId) => (
            [...acc, childId, ...getAllDescendantIds(controls, childId)]
        ), [])
    }
    return []
}

const deleteMany = (controls, ids) => {
    ids.forEach(id => delete controls[id])
}

export const {
    registerWebClientSuccess,
    registerWebClientError,
    createNode,
    increment,
    toggleExpand,
    addChild,
    removeChild,
    changeProps,
    deleteNode
} = pageSlice.actions

export default pageSlice.reducer