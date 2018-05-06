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
                nextId: 0,
                buckets: [
                    { name: 'Inbox', items: [] },
                    { name: 'Today', items: [] },
                    { name: 'This Week', items: [] },
                    { name: 'This Month', items: [] },
                    { name: 'This Year', items: [] },
                    { name: 'Some Day', items: [] },
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

    addItem(item) {
        this.updateAndSaveState(
            ({ nextId, buckets: [{ items, ...bucket }, ...rest] }) => ({
                nextId: nextId+1,
                buckets: [
                    { items: [{ text: item, id: nextId }, ...items], ...bucket },
                    ...rest
                ]
            })
        );
    }

    moveItem(curBucketIndex, curItemIndex, newBucketIndex) {
        this.updateAndSaveState(({ buckets: [...buckets] }) => {
            const { items: [...curItems], ...curBucket } = buckets[curBucketIndex];
            const [item] = curItems.splice(curItemIndex, 1);
            const { items: [...newItems], ...newBucket } = buckets[newBucketIndex];
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
                <a href={`#${data}`}>Sync</a>
            </div>
        );
    }
};

export default App;
