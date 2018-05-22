import React from 'react';

function ItemActions({ curBucketIndex, buckets, moveItem, removeItem }) {
    function action(index) {
        switch (index) {
            case 'delete': removeItem(); break;
            default: moveItem(index); break;
        }
    }
    return (
        <select onChange={ev => action(ev.target.value)}>
            <option selected={true} disabled={true} hidden={true}>-</option>
            <option value="delete">Delete</option>
            {
                buckets.map((bucket, index) =>
                    index === curBucketIndex
                        ? null
                        : <option key={index} value={index}>{bucket}</option>
                )
            }
        </select>
    );
};

export default ItemActions;