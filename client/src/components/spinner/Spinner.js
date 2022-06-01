import humanzSpinner from '../../assets/img/humanz-spinner.png';
import './spinner.css';

const Spinner = ({size}) => {
    return(
        <div class="spinner d-flex justify-content-center align-items-center">
            <img className='hummanz-spinner' src={humanzSpinner} style={{ width:`${size}px`}} alt="humanz-spinner"/>
        </div>
    )
}

export default Spinner;
