import React from "react";
import { FaUserEdit } from 'react-icons/fa';
import { TiDeleteOutline } from 'react-icons/ti';
import './client.css';

const Client = ({ client ,onDeleteClient, clientFormToggle}) => {

  return (
    <div className="card m-1 shadow-sm d-flex align-items-center">
      <div className="text-container mt-3">
        <h4>{client.name}</h4>
        <h5>{client.phone}</h5>
        <p>{client.email}</p>
        <h5>{client.client_id}</h5>
        <div className="client-buttons">
          <button className="px-1" onClick={() => onDeleteClient({ id:client.id })}>
            <TiDeleteOutline  size={'2.5em'}  />
          </button>
          <button className="px-1" onClick={() => clientFormToggle({client})}>
            <FaUserEdit  size={'2em'}  />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Client;