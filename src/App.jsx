import React, { Component } from 'react';
import Bucket from './Bucket';
import ItemInput from './ItemInput';
import './App.css';


class App extends Component {
    constructor(props) {
        super(props);
        if (props.hash) {
            const state = JSON.parse(atob(props.hash));
            this.state = state;
            this.saveStateInStorage(state);
        } else {
            this.state = this.loadStateFromStorage();
        }
    }

    loadStateFromStorage() {
        const stateJson = window.localStorage.getItem('state');
        const state = stateJson !== null
            ? JSON.parse(stateJson)
            : {
                nextId: 4,
                buckets: [
                    { name: 'Inbox', items: [{ id: 0, text: 'New tasks go here' }] },
                    { name: 'Today', items: [{ id: 1, text: 'Move me to Done through the dropdown' }] },
                    { name: 'This Week', items: [{ id: 2, text: 'Each day, move some items from here to Today' }] },
                    { name: 'This Month', items: [] },
                    { name: 'This Year', items: [] },
                    { name: 'Some Day', items: [{ id: 3, text: 'You can delete me' }] },
                    { name: 'Done', items: [] }
                ]
            };
        return state;
    }

    saveStateInStorage(state) {
        const stateJson = JSON.stringify(state);
        window.localStorage.setItem('state', stateJson);
    }

    updateAndSaveState(update) {
        this.setState(state =>
            {
                const newState = update(state);
                this.saveStateInStorage(newState);
                return newState;
            }
        );
    }

    addItem(text) {
        this.updateAndSaveState(
            ({ nextId, buckets: [{ items, ...bucket }, ...rest] }) => {
                const timestamp = new Date();
                const item = {
                    id: nextId,
                    text,
                    created: timestamp,
                    updated: timestamp
                };
                return {
                    nextId: nextId+1,
                    buckets: [
                        { items: [item, ...items], ...bucket },
                        ...rest
                    ]
                };
            }
        );
    }

    moveItem(curBucketIndex, curItemIndex, newBucketIndex) {
        this.updateAndSaveState(({ buckets: [...buckets] }) => {
            const { items: [...curItems], ...curBucket } = buckets[curBucketIndex];
            const [item] = curItems.splice(curItemIndex, 1);
            const { items: [...newItems], ...newBucket } = buckets[newBucketIndex];
            const timestamp = new Date();
            item.updated = timestamp;
            newItems.unshift(item);
            buckets[curBucketIndex] = { items: curItems, ...curBucket };
            buckets[newBucketIndex] = { items: newItems, ...newBucket };
            return { buckets };
        });
    }

    removeItem(curBucketIndex, curItemIndex) {
        this.updateAndSaveState(({ buckets: [...buckets] }) => {
            const { items: [...curItems], ...curBucket } = buckets[curBucketIndex];
            curItems.splice(curItemIndex, 1);
            buckets[curBucketIndex] = { items: curItems, ...curBucket };
            return { buckets };
        });
    }

    uploadFile(ev) {
        const reader = new FileReader();
        reader.readAsText(ev.target.files[0], 'UTF-8');
        reader.onload = ev => {
            const state = JSON.parse(ev.target.result);
            this.updateAndSaveState(_ => state);
        };
    }

    render() {
        const { buckets } = this.state;
        const bucketNames = buckets.map(bucket => bucket.name);
        const data = btoa(JSON.stringify(this.state));
        return (
            <div className="App">
                <ItemInput addItem={this.addItem.bind(this)}/>
                {
                    buckets.map((bucket, index) =>
                        <Bucket
                            key={index}
                            curBucketIndex={index}
                            buckets={bucketNames}
                            moveItem={(cII, nBI) => this.moveItem(index, cII, nBI)}
                            removeItem={cII => this.removeItem(index, cII)}
                            {...bucket} />
                    )
                }
                <p>
                    <a href={`#${data}`}>Sync</a> |
                    <a href={`data:application/octet-stream;charset=utf-16le;base64,${data}`} download="buckets.json">Download</a> |
                    Upload: <input type="file" accept=".json" onChange={this.uploadFile.bind(this)} />
                </p>
                <p>
                    <a href="https://github.com/curtislusmore/bucket">GitHub</a>
                </p>
            </div>
        );
    }
};

export default App;
