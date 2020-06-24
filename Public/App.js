
import React from 'react';


class App extends React.Component {
    constructor(props){
        super(props);
        this.state={  
            groceryList:[],
            userId:'',
            orderStatus:'NoList'
        }  
        this.handleClick = this.handleClick.bind(this);             

    }
    componentDidMount()
    {
        const existingScript = document.getElementById('Messenger');        
        if (!existingScript) {
            const script = document.createElement("script");
            script.src = "//connect.facebook.com/en_US/messenger.Extensions.js";
            script.id="Messenger";
            script.async = true;
            document.body.appendChild(script);   
        }
        const params=new URLSearchParams(this.props.location.search);
        let list=params.get("groceryList");
        let arr=list ? list.split(","):[];
        this.setState({groceryList:arr, userId:params.get("sid")});
    }    
    handleClick(){
        if(this.state.groceryList && this.state.groceryList.length >0)
        {
            this.setState({orderStatus:'OrderConfirmed'});
        }
        MessengerExtensions.requestCloseBrowser(function success() {
            console.log("Webview closing");
        }, function error(err) {
            console.log(err);
        });
    }

    createGroceryList(){
        let list=this.state.groceryList;
        return (
            list ? 
            <div>
                 <ol>
            {
            list.map( (element,i) => {
                return ( 
                        <li>{capitalize_Words(element)}</li>
                )
            })}
            </ol></div> :"No List Found"
        );
    }
    render(){
        return (
            <div className="container">
                <br></br>
                <div className="row pt-20">                                   
                <div className="panel panel-primary">                    
                            <div className="panel-heading">Below you can choose the options for buying:-</div>
                            <div className="panel-body">
                                <form action="/options/orderspostback" method="get"> 
                                <input type="hidden" name="psid" id="psid" value={this.state.userId}></input>
                                <input type="hidden" name="orderStatus" value={this.state.orderStatus}></input>
                                {this.createGroceryList()}
                                <button type="submit" id="submitButton" className="btn btn-primary" onClick={this.handleClick}>Place Order</button>
                                </form>
                            </div>
                        </div>
                        <h4>We are displaying the grocery list now.</h4> 
                        <h4>The site is in construction for the Grocery Delivery. </h4>
                </div>
            </div>
        );
    }
}
function capitalize_Words(str)
{
 return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
export default App;