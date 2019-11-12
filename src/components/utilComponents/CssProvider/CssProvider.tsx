import React from "react";


interface IProps {
    // theme: any,
    children: any,
    globalStyle?: React.CSSProperties | undefined,
    className?: string | undefined,
}

export const CssProvider: React.FC<IProps> = ({ 
    // theme,
     children, globalStyle, className }: IProps) => {
    // const node: any = useRef(null);

    // useEffect(() => {
    //     Object.entries(theme).forEach(([prop, value]) => {
    //         node.current.style.setProperty('--' + prop, value);
    //         console.log('--' + prop, value)
    //     });
    // });

    return (
        <div className={className} style={globalStyle}>{children}</div>
    );
}


// class Theme extends Component {
//     node = createRef();

//     componentDidMount() {
//         this.updateCSSVariables();
//     }

//     componentDidUpdate(prevProps) {
//         if (this.props.variables !== prevProps.variables) {
//             this.updateCSSVariables();
//         }
//     }

//     updateCSSVariables() {
//         Object.entries(this.props.variables).forEach(([prop, value]) => this.node.current.style.setProperty(prop, value));
//     }

//     render() {
//         const { children } = this.props;
//         return <div ref={this.node}>{children}</div>;
//     }
// }

