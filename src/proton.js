import React from 'react';









export class Proton {
    subscriptionId = 1;
    subscriptions = {};

    size;

    protonName = 'unknown';
    protonFactor = 0;

    breakpoints;
    protonNameMin;
    breakpointNameToIndex;
    minBreakpoint;
    maxBreakpoint;

    constructor(
        protonNameMin = 'xxs',
        breakpoints = {xs: 280, s: 340, m: 576, l: 768, xl: 992, xxl: 1200}
    ) {
        this.protonNameMin = protonNameMin;

        const keys = Object.keys(breakpoints);
        if (keys.length < 2) {
            throw new Error(`At least 2 breakpoints must be given. ${keys.length} given`);
        }

        this.minBreakpoint = keys.reduce(
            (acc, key) => acc !== undefined ? Math.min(acc, breakpoints[key]) : breakpoints[key],
            undefined
        );
        this.maxBreakpoint = keys.reduce(
            (acc, key) => acc !== undefined ? Math.max(acc, breakpoints[key]) : breakpoints[key],
            undefined
        );



        this.breakpoints = keys.map(key => {
            const name = key;
            const breakpoint = breakpoints[key];

            return {name, breakpoint};
        });

        this.breakpoints.sort((a, b) => {
            if (a.breakpoint < b.breakpoint) {
                return -1;
            }

            if (a.breakpoint > b.breakpoint) {
                return 1;
            }

            throw new Error(`breakpoints should not have identical values: ${a.name}:${a.breakpoint} vs. ${b.name}:${b.breakpoint}`);
        });

        this.breakpointNameToIndex = {
            [protonNameMin]: -1
        };
        this.breakpoints.forEach((breakpoint, index) => {
            this.breakpointNameToIndex[breakpoint.name] = index;
        });
    }

    subscribe(cb) {
        const id = this.subscriptionId++;
        this.subscriptions[id] = cb;
        this.callBack(cb);

        return () => delete this.subscriptions[id];
    }

    callBack(cb) {
        cb(this.protonFactor);
    }

    setSize(size) {
        this.size = size;
        this.update();

        const keys = Object.keys(this.subscriptions);
        keys.forEach(key => this.callBack(this.subscriptions[key]));
    }

    factor(w, min, max) {
        return Math.min(1, Math.max(0, (w - min) / (max - min)));
    };

    update() {
        this.protonName = this.protonNameMin;
        for (let i = 0; i < this.breakpoints.length; i++) {
            const breakpoint = this.breakpoints[i];

            if (this.size < breakpoint.breakpoint) {
                break;
            }

            this.protonName = breakpoint.name;
        }

        this.protonFactor = this.factor(this.size, this.minBreakpoint, this.maxBreakpoint);
    }

    clear() {
        this.subscriptions = {};
    }
}

export class ProtonProvider extends React.Component {

    componentWillUnmount() {
        this.proton.clear();
    }

    getChildContext() {
        return {
            proton: this.props.proton
        };
    }

    render() {
        return this.props.children;
    }

}

ProtonProvider.childContextTypes = {
    proton: React.PropTypes.any.isRequired
};

ProtonProvider.propTypes = {
    proton: React.PropTypes.object.isRequired
};








export const protonize = (Component) => {

    class Protonized extends React.Component {
        
        unsubscribe;

        constructor(props, context) {
            super(props, context);

            this.state = {
                protonFactor: 1
            };
        }

        componentDidMount() {
            this.unsubscribe = this.context.proton.subscribe(
                protonFactor => this.setState({protonFactor})
            );
        }

        componentWillUnmount() {
            this.unsubscribe();
        }

        render() {

            return (
                <Component
                    {...this.props}
                    proton={this.context.proton}
                    protonFactor={this.state.protonFactor}
                />
            );
        }
    }

    Protonized.contextTypes = {
        proton: React.PropTypes.any.isRequired
    };


    return Protonized;

};


















const Electron_ = (props, context) => {
    const style = {
        ...protonStyle(props.style, context.proton),
        display: 'inline-block'
    };

    if (props.cols) {
        let protonName = props.proton.protonName;
        let protonIndex = context.proton.breakpointNameToIndex[protonName];
        
        if (protonIndex !== undefined) {
            while(!(protonName in props.cols)) {
                if (protonIndex === -1) {
                    break;
                }

                protonName = context.proton.breakpoints[protonIndex].name;
                protonIndex--;
            }

            const factor = protonIndex !== -1 ? props.cols[protonName] : 1;
            style.width = `${factor*100}%`;
        }
        
    }

    return (
        <div style={style}>
            {props.children}
        </div>
    );
};

Electron_.contextTypes = {
    proton: React.PropTypes.any.isRequired
};

export const Electron = protonize(Electron_);


export const protonStyle = (protonStyle_, proton) => {
    if (!protonStyle_) {
        return null;
    }

    const style = {};
    const keys = Object.keys(protonStyle_);
    keys.forEach(key => {
        const attr = protonStyle_[key];
        
        if (Array.isArray(attr)) {
            style[key] = attr[0] + (attr[1] - attr[0]) * proton.protonFactor;
        } else if (typeof attr === 'object') {
            let protonName = proton.protonName;
            let protonIndex = proton.breakpointNameToIndex[protonName];
            
            if (protonIndex !== undefined) {
                while(!(protonName in attr)) {
                    
                    if (protonIndex === -1) {
                        protonName = proton.protonNameMin;
                        break;
                    }
                    
                    protonName = proton.breakpoints[protonIndex].name;
                    protonIndex--;
                }

                if (protonName in attr) {
                    style[key] = attr[protonName];
                }
            }
        } else {
            style[key] = attr;
        }
    });

    return style;
};
