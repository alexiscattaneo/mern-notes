import React, {Component} from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default class CreateNote extends Component {

    state = {
        users: [],
        userSelected: '',
        title: '',
        content: '',
        date: new Date(),
        editing:false,
        _id: ''
    }

    async componentDidMount(){
        const res = await axios.get('https://cryptic-fortress-49132.herokuapp.com/api/users');
        this.setState({
            users: res.data.map(user => user.username),
            userSelected: res.data[0].username
        });
        if(this.props.match.params.id){
            const res = await axios.get('https://cryptic-fortress-49132.herokuapp.com/api/notes/'+this.props.match.params.id);
            this.setState({
               title:res.data.title,
               content:res.data.content,
               userSelected:res.data.author,
               date:new Date(res.data.date),
               editing:true,
               _id:this.props.match.params.id
            })
        }
        console.log(this.state);
    }

    onSubmit = async (e) => {
        e.preventDefault();
        const newNote = {
            title: this.state.title,
            content: this.state.content,
            author: this.state.userSelected,
            date: this.state.date
        };
        if(this.state.editing){
            await axios.put('https://cryptic-fortress-49132.herokuapp.com/api/notes/'+this.state._id, newNote);
        }else{            
            await axios.post('https://cryptic-fortress-49132.herokuapp.com/api/notes', newNote);
        }
        console.log(this.state);
        window.location.href = '/';
    }

    onInputChange = (e) => {        
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onChangeDate = (date) => {
        console.log(this.state.date);
        console.log(date);
        if(this.state.date === date){
            console.log('son iguales');
        }else{
            console.log('diferentes!!');
            this.setState({date: new Date(date)});
        }
        setTimeout(
            function() {
                console.log(this.state);
            }
            .bind(this),
            3000
        );        
        
    }  

    render(){
        return (
            <div className="col-md-6 offset-md-3">
                <div className="card card-body">
                    <h4>Create a note</h4>
                    <form onSubmit={this.onSubmit}>
                        {/*SELECT USER */}
                        <div className="form-group">
                            <select 
                            className="form-control" 
                            name="userSelected" 
                            onChange={this.onInputChange}
                            value={this.state.userSelected}
                            >
                                {
                                    this.state.users.map(user => 
                                    <option key={user} value={user}>
                                        {user}
                                    </option>    
                                    )
                                }
                            </select>
                        </div>

                        <div className="form-group">
                                <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Title" 
                                name="title"
                                onChange={this.onInputChange} 
                                value={this.state.title}
                                required/>
                        </div>

                        <div className="form-group">
                                <textarea 
                                required
                                className="form-control" 
                                placeholder="Content" 
                                name="content"
                                onChange={this.onInputChange} 
                                value={this.state.content}
                                >

                                </textarea>
                        </div>

                        <div className="form-group">
                                <DatePicker 
                                className="form-control"
                                name="date"
                                selected={this.state.date}
                                onChange={this.onChangeDate}/>
                        </div>

                        <button type="submit" className="btn btn-primary">
                            Save
                        </button>
                    </form>
                </div>
            </div>
        )
    }
}