import React from 'react';
import './Item.css';


function Item({ text, curBucketIndex, buckets, moveItem, removeItem }) {
    function action(index) {
        switch (index) {
            case '-2': break;
            case '-1': removeItem(); break;
            default: moveItem(index); break;
        }
    }
    return (
        <tr className="Item">
            <td>{text}</td>
            <td>
                <select onChange={ev => action(ev.target.value)}>
                    <option key={-2} value="-2">-</option>
                    <option key={-1} value="-1">Delete</option>
                    {
                        buckets.map((bucket, index) =>
                            index === curBucketIndex
                                ? null
                                : <option key={index} value={index}>{bucket}</option>
                        )
                    }
                </select>
            </td>
        </tr>
    )
};

export default Item;
