# react-proton
`react-proton` is designed for you to build **continuous and discret responsive** websites.
That means you are able to deduce every attribute from a changing continuous value, e.g. the screen size (it could also be any other, like time of the day in minutes).

## Live Demo
[react-proton-example](https://daaitch.github.io/react-proton-example/)

## Protons and Electrons

The `Proton` is the core of your application. It keeps the current value you are interested in and everytime it changes, all `Electrons` are notified.
`Electrons` can be given react-styles with values:

1. as known constant values: `fontSize: 10`
1. as discret relative to breakpoints: `fontSize: { m: 10, l: 20 }`
1. as interpolation expression: `fontSize: [10, 20]`


## Show me some code

**index.js**
```jsx
import React from 'react';
import { Proton, ProtonProvider } from 'react-proton';
import MyComponent from './MyComponent';

// uses default for proton constructor
// protonNameMin = 'xxs',
// breakpoints = {xs: 280, s: 340, m: 576, l: 768, xl: 992, xxl: 1200}
const proton = new Proton(); 
        
const updateSize = () => proton.setSize(window.innerWidth)
window.addEventListener('resize', updateSize);
updateSize();

ReactDOM.render(
    <ProtonProvider proton={proton}>
        <MyComponent />
    </ProtonProvider>,
    document.getElementById('root')
);

```

**MyComponent.js**
```jsx
import React from 'react';
import { Electron } from 'react-proton';

class MyComponent extends React.Component {

    cols = {
        // default 100%
        m: 1/2, // 50%
        l: 1/3, // 33%
        xl: 1/4 // 25%
    };

    // const values as in react
    electron1Style = {
        color: 'red'
    };

    // discret values for each breakpoint
    electron2Style = {
        padding: {
            m: '20px',
            // implicitly `l: '20px'` from "m"
            xl: '40px'
        }
    };

    // continuous values relative to min and max breakpoint
    electron3Style = {
        // a value between 10-20 relative from min breakpoint (10) to max breakpoint (20)
        fontSize: [10, 20] // lacks of unit
    };
    
    // or everything mixed
    electron4Style = {
        ...this.electron1Style,
        ...this.electron2Style,
        ...this.electron3Style,
    };

    render() {
        return (
            <div>
                <Electron cols={this.cols} style={electron1Style}>Electron 1</Electron>
                <Electron cols={this.cols} style={electron2Style}>Electron 2</Electron>
                <Electron cols={this.cols} style={electron3Style}>Electron 3</Electron>
                <Electron cols={this.cols} style={electron4Style}>Electron 4</Electron>
            </div>
        );
    }
}

export default MyComponent;
```

## Roadmap

### ✔ Implement `Proton`, `Electron` and simple style interpolation.
### ... `protonStyle` interpolation should understand units and colors.
### ... add `Neutron` to seperate responsibility.
Maybe
- `Neutron` for style-interpolation
- `Electron` for responsibility (short-hand `Neutron` for `width` attribute)

To be discussed...
### ... Ability to define many `Protons` to deduce from many values
e.g.
- `screenProton` deduced from `window.innerWidth`: make page responsive
- `minutesOfDayProton` deduced from `date.getHours() * 60 + date.getMinutes()`: our awesome page should be bright in the morning and getting darker in the afternoon
- `mainContentProton` deduced from *"width of main div"*: user can change width of menu and we want main content to be responsive to its available width

### ... Investigate/do seperate discrete and continuous deduction components
e.g. `ComponentA` needs high accuracy and operates on continuous value, while `ComponentB` does not and only needs to be triggered, when breakpoint changes.

ideas:
- composite pattern *compiles* `Neutrons` and split them into continuous and discrete deduction components