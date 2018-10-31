/**
 * @file 驾车组件
 * @author kyle(hinikai@gmail.com)
 */

import Component from './component';

class MyDrivingRoute extends Component {

    constructor(args) {
        super(args);
        this.state = {
        };
    }

    /**
     * 设置默认的props属性
     */
    static get defaultProps() {
        return {
        }
    }

    componentDidUpdate(prevProps) {
        this.initialize();
    }

    componentDidMount() {
        this.initialize();
    }

    componentWillUnmount() {
        this.destroy();
    }

    destroy() {
        this.driving && this.driving.clearResults();
        this.driving = null;
    }

    initialize() {

        var map = this.props.map;
        if (!map) {
            return;
        }

        this.destroy();

        if (!this.driving) {
            this.driving = new BMap.DrivingRoute(map, {renderOptions:{
                map: map,
                policy: this.props.policy || BMAP_DRIVING_POLICY_LEAST_TIME,
                autoViewport: true
            }});
        }

        //var start = this.props.start;
        //var end = this.props.end;

        const start = new BMap.Point(this.props.start.lng, this.props.start.lat);
        const end = new BMap.Point(this.props.end.lng, this.props.end.lat);

        this.driving.search(start, end);

    }

}

export default MyDrivingRoute;
