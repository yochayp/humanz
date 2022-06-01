import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:3000/',
});

export const addNewClient = async ({ name, phone, email, clientId }) => {
    try {
        const { data } = await api.post(
            `client`,
            { name, phone, email, clientId }
        );
        return data;
    } catch (error) {
        throw Error(error.response.statusText);
    }
};

export const updateClient = async ({ name, phone, email, id }) => {
    try {
        const { data } = await api.patch(
            `client/${id}`,
            { name, phone, email, id }
        );
        return data;
    } catch (error) {
        throw Error(error.response.statusText);
    }
};


export const deleteClient = async ({ id }) => {
    try {
        const { data } = await api.delete(
            `clients/${id}`,
        );
        return data;
    } catch (error) {
        throw Error(error.response.statusText);
    }
};

export const fetchClients = async ( page, filter ) => {
    try {
        const { data } = await api.get(`/clients?npp=10&page=${page}&filter=${filter}`);
        return data;
    } catch (error) {
        console.log('error');
        throw Error("Unable to fetch clients");
    }
};
