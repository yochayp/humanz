import React, { useState } from "react";
import { addNewClient, updateClient, fetchClients, deleteClient } from "../api/api";
import { useQuery, useMutation, useQueryClient } from "react-query";
import Navbar from "../components/navbar/Navbar";
import useModal from "../components/modal/useModal";
import Modal from "../components/modal/Modal";
import Client from "../components/client/Client";
import Spinner from "../components/spinner/Spinner";
import './home.css'

const Home = () => {
    const [page, setPage] = useState(0);
    const [filter, setFilter] = useState("");
    const [clientData, setClientData] = useState();
    const [clientId, setClientId] = useState();
    const [submitLoading, setSubmitloading] = useState(false);
    const [submitError, setSubmitError] = useState(false);
    const { isShowing, toggleClientModal } = useModal();
    
    const clientFormToggle = ({ client }) => {
        if (client) setClientId(client.id);
        setClientData(client);
        setSubmitError(false);
        toggleClientModal();
    }

    const handleFilterChange = (pattern) => {
        setFilter(pattern);
    }

    const queryClient = useQueryClient();

    const { data, isLoading, isError } = useQuery(
        ["clients", filter, page],
        () => fetchClients(page, filter),
        {
            keepPreviousData: true,
        }
    );

    const usersMutation = useMutation(id => deleteClient(id), {
        onError: (error) => {
            console.log("error");
        },
        onSuccess: () => {
            queryClient.invalidateQueries("clients");
        },
    });

    const { mutateAsync } = useMutation(
        clientData ? "updateClient" : "addNewClient",
        clientData ? updateClient : addNewClient,
        {
            onSuccess: () => {
                setClientData();
                toggleClientModal();
                queryClient.invalidateQueries("clients");
            },

            onMutate: async (newClient) => {
                if (clientData) {
                    await queryClient.cancelQueries("client");
                    const previousClient = queryClient.getQueryData(["client", clientId]);

                    queryClient.setQueryData(["client", clientId], (old) => {
                        return { data: newClient };
                    });

                    return { previousClient };
                }
            },
            onError: (context) => {
                setSubmitError(true);
                queryClient.setQueryData(["client", clientId], context.previousClient);
            },
            onSettled:()=>{
                setSubmitloading(false);
            }
        }
    );

    const onDeleteClient = ({ id }) => {
        usersMutation.mutate({ id });
    };

    const submitForm = async (client) => {
        setSubmitloading(true);
        clientData
            ? await mutateAsync({ name: client.fullName, phone: client.phoneNumber, email: client.email, id: clientId })
            : await mutateAsync({ name: client.fullName, phone: client.phoneNumber, email: client.email, clientId: client.id });
    }

    return (
        <div className="App">
            <Navbar clientFormToggle={clientFormToggle} filter={filter} handleFilterChange={handleFilterChange} />
            <Modal isShowing={isShowing} hide={toggleClientModal} clientData={clientData} submitForm={submitForm} submitLoading={submitLoading} submitError={submitError}/>
            <div className="container d-flex justify-content-center align-items-center">
                {isLoading ? 
                <Spinner size={150} />
                : isError ? <h1>error...</h1> :
                    <div className="clients d-flex justify-content-center py-5">
                        {data.results.map((client) => (
                            <Client key={client.id} client={client} onDeleteClient={onDeleteClient} clientFormToggle={clientFormToggle} />
                        ))}
                        <div className="pagination-buttons">
                            <button
                                className={"previous-button hover-color " + (page === 0 ? 'disable-button' : '')}
                                onClick={() => setPage((old) => Math.max(old - 1, 0))}
                                disabled={page === 0}
                            >
                                Previous
                            </button>
                            <button
                                className={"next-button hover-color " + (!data.pagination.next ? 'disable-button' : '')}
                                onClick={() => setPage((old) => old + 1)}
                                disabled={!data.pagination.next}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}

export default Home;