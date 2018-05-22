import React from 'react';
import './Item.css';

function Item({ text, actions }) {
    return (
        <tr className="Item">
            <td>{text}</td>
            <td>{actions}</td>
        </tr>
    )
};

export default Item;
