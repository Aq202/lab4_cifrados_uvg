import React from 'react';
import PropTypes from 'prop-types';
import styles from './CheckBox.module.css';

function CheckBox({ label, onChange, checked }) {
  return (
    <label className={styles.checkBoxContainer}>
      <input
        type="checkbox"
        className={styles.inputHidden}
        checked={checked}
        onChange={onChange}
      />
      <span className={styles.customCheckBox} />
      <span className={styles.labelText}>{label}</span>
    </label>
  );
}

CheckBox.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool,
};

CheckBox.defaultProps = {
  checked: false,
};

export default CheckBox;
