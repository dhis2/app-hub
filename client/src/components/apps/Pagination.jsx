import PropTypes from 'prop-types'
import React from 'react'

const Pagination = () => (
    <p style={{ color: 'red', fontWeight: 'bold' }}>Todo</p>
)

Pagination.propTypes = {
    page: PropTypes.number.isRequired,
    pageCount: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
}

export default Pagination
