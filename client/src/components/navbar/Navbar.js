import humanzLogo from'../../assets/img/humanz-logo.png';
import './navbar.css';

const Navbar = ({clientFormToggle,filter,handleFilterChange}) => {
    return (
        <nav class="navbar  navbar-light bg-white border-bottom shadow-sm  py-3 px-5">
            <div class="container-fluid">
                <div className='d-flex align-items-center'>
                    <img  src={humanzLogo} alt="humanz-logo"/>
                    <h3 className='mx-3 pt-3'>Clients</h3>
                </div>
                <div className="header-right d-flex">
                    <div className="mx-4">
                    </div>
                    <div className='d-flex'>
                        <div>
                            <input
                            className='search-input'
                            type="text"
                            placeholder="Search here"
                            onChange={(e) => handleFilterChange(e.target.value)}
                            value={filter} />
                        </div>
                        <div>
                            <button className="create-button hover-color" onClick={() => clientFormToggle({})}>create client</button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;