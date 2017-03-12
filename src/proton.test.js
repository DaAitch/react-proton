import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import { Electron, Proton, protonStyle, ProtonProvider } from './proton';
import 'jasmine';

const asyncTest = run => done => run().then(done, err => { fail(err); done(); });

describe('Proton', () => {
    it('should calculate factors and derive proton names', () => {
        const s1 = 100;
        const s2 = 200;
        
        const proton = new Proton('s0', {s1, s2});

        proton.setSize(50);
        expect(proton.protonName).toBe('s0');
        expect(proton.protonFactor).toBe(0);

        proton.setSize(99);
        expect(proton.protonName).toBe('s0');
        expect(proton.protonFactor).toBe(0);

        proton.setSize(100);
        expect(proton.protonName).toBe('s1');
        expect(proton.protonFactor).toBe(0);

        proton.setSize(101);
        expect(proton.protonName).toBe('s1');
        expect(proton.protonFactor).toBe(1/100);

        proton.setSize(199);
        expect(proton.protonName).toBe('s1');

        proton.setSize(200);
        expect(proton.protonName).toBe('s2');

        proton.setSize(201);
        expect(proton.protonName).toBe('s2');

        proton.setSize(2349802384);
        expect(proton.protonName).toBe('s2');
    });

    it('should subscribe and unsubscribe', () => {
        const s1 = 100;
        const s2 = 200;
        const proton = new Proton('s0', {s1, s2});

        const spy1 = jasmine.createSpy();
        const spy2 = jasmine.createSpy();

        proton.setSize(100);
        const unsubscribe1 = proton.subscribe(spy1);

        expect(spy1).toHaveBeenCalledWith(0);
        expect(spy2).not.toHaveBeenCalled();

        const unsubscribe2 = proton.subscribe(spy2);

        proton.setSize(150);
        expect(spy1).toHaveBeenCalledWith(0.5);
        expect(spy2).toHaveBeenCalledWith(0.5);

        unsubscribe1();

        proton.setSize(200);
        expect(spy1).not.toHaveBeenCalledWith(1);
        expect(spy2).toHaveBeenCalledWith(1);
    });

    it('should calculate breakpoint name to indices', () => {
        const s1 = 100;
        const s2 = 200;
        const s3 = 300;
        const proton = new Proton('s0', {s2, s3, s1}); // shuffled breakpoints

        expect(proton.breakpointNameToIndex).toEqual({
            s0: -1,
            s1: 0,
            s2: 1,
            s3: 2
        });
    });
});

describe('<Electron />', () => {

    it('should render without crashing', () => {
        const wrapper = mount(<Electron />, {
            context: {proton: new Proton()}
        });
    });

    it('should generate correct html', () => {
        const s1 = 100;
        const s2 = 200;

        const proton = new Proton('s0', {s1, s2});
        proton.setSize(100);

        const wrapper = mount(<Electron cols={{s0: 1, s1: 0.5, s2: 0.25}}>child</Electron>, {
            context: {proton}
        });
        
        expect(wrapper.html()).toBe('<div style="display: inline-block; width: 50%;">child</div>');

        proton.setSize(500);
        expect(wrapper.html()).toBe('<div style="display: inline-block; width: 25%;">child</div>');
    });

    it('should use 100% if no col definition found', () => {
        const s1 = 100;
        const s2 = 200;

        const proton = new Proton('s0', {s1, s2});
        proton.setSize(100);

        const wrapper = mount(<Electron cols={{s2: 0.25}}>child</Electron>, {
            context: {proton}
        });
        
        expect(wrapper.html()).toBe('<div style="display: inline-block; width: 100%;">child</div>');
    });

});

describe('protonStyle', () => {
    let proton;

    beforeEach(() => {
        const s1 = 100;
        const s2 = 200;

        proton = new Proton('s0', {s1, s2});
        proton.setSize(0);
    });

    it('should return empty object empty style object', () => {
        expect(protonStyle({}, proton)).toEqual({});
    });

    it('should return null for falsy style', () => {
        expect(protonStyle(null, proton)).toBe(null);
        expect(protonStyle(undefined, proton)).toBe(null);
    });

    it('should calculate style according to proton factor and proton name', () => {
        const style = {
            style1: 'value1',
            style2: [10, 50],
            style3: {
                s0: 'value1',
                s1: 'value2',
                s2: 'value3'
            }
        };

        proton.setSize(150);

        expect(protonStyle(style, proton)).toEqual({
            style1: 'value1',
            style2: 30,
            style3: 'value2'
        });
    });
    
    it('should omit style if not match', () => {
        const style = {
            style1: 'value1',
            style2: [10, 50],
            style3: {
                s2: 'value3'
            }
        };
        expect(protonStyle(style, proton)).toEqual({
            style1: 'value1',
            style2: 10
        });
    });

    it('should combine style with min size proton', () => {
        const style = {
            style1: {
                s0: 'value0',
                s2: 'value2'
            }
        };

        proton.setSize(80);

        expect(protonStyle(style, proton)).toEqual({
            style1: 'value0'
        });
    });
});

describe('<ProtonProvider />', () => {
    it('should provide proton', () => {
        const s1 = 100;
        const s2 = 200;
        const proton = new Proton('s0', {s1, s2})

        const X = (props, context) => <p>{context.proton.protonFactor}</p>;
        X.contextTypes = {
            proton: React.PropTypes.object.isRequired
        };
        const wrapper = mount(<ProtonProvider
            proton={proton}
        ><X /></ProtonProvider>);

        wrapper.update();
        expect(wrapper.text()).toBe('0');

        proton.setSize(150);
        wrapper.update();
        expect(wrapper.text()).toBe('0.5');

        proton.setSize(200);
        wrapper.update();
        expect(wrapper.text()).toBe('1');
    });
});