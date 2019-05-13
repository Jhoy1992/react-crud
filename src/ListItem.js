import React from 'react';

const ListItem = (props) => {        
            
    return <li className="list-group-item">   

        {props.item.name}

        <button className="btn btn-sm btn-info ml-4"
        onClick={props.editTodo}
        >U</button>

        <button className="btn btn-sm btn-danger ml-2"
        onClick={props.deleteTodo}        
        >X</button>
    </li>   
                   
}      

export default ListItem;