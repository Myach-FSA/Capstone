import React from 'react';
import ReactDOM, { render } from 'react-dom';
import { connect } from 'react-redux'

const balls = [
  {name: 'First Ball', description: 'First ball description'}, 
  {name: 'Second Ball', description: 'Second ball description'}, 
  {name: 'Third Ball', description: 'Third ball description'},
  {name: 'Fourth Ball', description: 'Fourth ball description'}, 
  {name: 'Fifth Ball', description: 'Fifth ball description'}]

const ChooseBall = () => {
  return (
    <div className="content has-text-centered">
    <h1>Choose Your Ball</h1> 
    <div className="horiz-marg">
      <div className="columns is-multiline">
          {balls && balls.map((ball, i) => (
              <article key={ball.id}
                className="column is-one-third product-grid-item">
                <div className="inner-product">
                  <br />
                  <figure className="image">
                    <img src="http://bulma.io/images/placeholders/1280x960.png" alt="Image"/>
                  </figure>
                  <p className="subtitle">{ball.name}</p>
                  <p className="subtitle">{ball.description}</p>
                  <a className="button is-success is-outlined playnow" href="/game">Choose Now!</a>
                </div>
              </article>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ChooseBall;

{/* 
const mapState = (state, componentProps) => ({
  products: componentProps.match.params.category
    ? state.products.allProducts
      .filter(product =>
        product.category === componentProps.match.params.category)
    : state.products.allProducts
})

export default connect(mapState)(ProductGrid) */}