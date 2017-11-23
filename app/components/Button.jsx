import React from 'react';

const Button = (props) => (
  <button
  className="button is-success"
  type="submit"
  title={props.title}
  onClick={() => { props.ready(); }}
  disabled = {props.disabled}
>
  {props.title}
</button>);

export default Button;
