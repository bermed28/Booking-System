import PropTypes from 'prop-types'

const ButtonOld = ({ color, text, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{ backgroundColor: color }}
      className='btn'
    >
      {text}
    </button>
  )
}

ButtonOld.defaultProps = {
  color: 'steelblue',
}

ButtonOld.propTypes = {
  text: PropTypes.string,
  color: PropTypes.string,
  onClick: PropTypes.func,
}

export default ButtonOld