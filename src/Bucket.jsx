import React from 'react';
import Item from './Item';
import './Bucket.css';


function Bucket({ name, items, buckets, moveItem, removeItem }) {
    return (
        <table className="Bucket">
            <thead>
                <tr><th colSpan="2">{ name }</th></tr>
            </thead>
            <tbody>
                {
                    items.length === 0
                        ? <tr><td className="Empty" colspan="2">Empty</td></tr>
                        : items.map((item, index) =>
                            <Item
                                key={item.id}
                                buckets={buckets}
                                moveItem={nBI => moveItem(index, nBI)}
                                removeItem={() => removeItem(index)}
                                {...item}/>
                        )
                }
            </tbody>
        </table>
    )
};

export default Bucket;
