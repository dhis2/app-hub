import PropTypes from 'prop-types'
import React from 'react'
import FlatButton from 'material-ui/FlatButton'

const styles = {
    currentPage: {
        margin: '0 0.5em'
    }
}

const Pagination = ({ page, pageCount, onPageChange }) => (
    <>
        <FlatButton label="Previous page" onClick={() => onPageChange(page - 1)} disabled={page == 1} />
        <span style={styles.currentPage}>{`Page ${page} of ${pageCount}`}</span>
        <FlatButton label="Next page" onClick={() => onPageChange(page + 1)} disabled={page == pageCount} />
    </>
)

Pagination.propTypes = {
    page: PropTypes.number.isRequired,
    pageCount: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
}

export default Pagination
