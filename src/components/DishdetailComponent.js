import React,{ Component } from 'react';
import { Card, CardImg, CardText, CardBody,CardTitle, Breadcrumb, BreadcrumbItem, Button,
    Modal, ModalHeader, ModalBody, Label, Row } from 'reactstrap';
import { List } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);
    class ComponentForm extends Component {
        constructor(props) {
            super(props);
            this.state = { 
                isCommentModalOpen: false
            }
            this.toggleCommentModal = this.toggleCommentModal.bind(this);
            this.handleSubmit=this.handleSubmit.bind(this);
        }
        toggleCommentModal(){
            this.setState({isCommentModalOpen: !this.state.isCommentModalOpen});
        }
        handleSubmit(values){
            this.toggleCommentModal();
            this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);
        }
        render() { 
            return (
                <div>
                    <Button outline onClick={this.toggleCommentModal}><i class="fa fa-lg fa-pencil" aria-hidden="true"></i> Submit Comment</Button>{' '}
                    <Modal isOpen={this.state.isCommentModalOpen} toggle={this.toggleCommentModal}>
                        <ModalHeader toggle={this.toggleCommentModal}>Submit Comment</ModalHeader>
                        <ModalBody>
                            <div className="container">
                                <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                                    <Row className="form-group">
                                        <Label htmlFor="rating">Rating</Label>
                                        <Control.select model=".rating" name="rating" id="rating" className="form-control" defaultValue="1">
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                        </Control.select>
                                    </Row>
                                    <Row className="form-group">
                                        <Label htmlFor="author">Your Name</Label>
                                        <Control.text model=".author" id="author" name="author" placeholder="Your Name" className="form-control"
                                            validators={{
                                                required,minLength: minLength(3), maxLength: maxLength(15)
                                            }}/>
                                        <Errors className="text-danger" model=".yourname" show="touched" messages={{
                                            required : ' Must be greater than 2 characters',
                                            minLength: ' Must be greater than 2 characters',
                                            maxLength: ' Must be 15 characters or less',
                                        }} />
                                    </Row>
                                    <Row className="form-group">
                                            <Label htmlFor="comment">Comment</Label>
                                            <Control.textarea model=".comment" id="comment" name="comment" placeholder="" rows="6" className="form-control"/>        
                                    </Row>
                                    <Row className="form-group">
                                        <Button type="submit" color="primary">
                                            Submit
                                        </Button>
                                    </Row>
                                </LocalForm>
                            </div>
                        </ModalBody>
                    </Modal>
                </div>
            );
        }
    }
    function RenderDish({dish}){
        return(
            <FadeTransform
                in
                transformProps={{
                    exitTransform: 'scale(0.5) translateY(-50%)'
                }}>
            <Card>
                <CardImg top src={baseUrl + dish.image} alt={dish.name} />
                <CardBody>
                    <CardTitle>{dish.name}</CardTitle>
                    <CardText>{dish.description}</CardText>
                </CardBody>
            </Card>
            </FadeTransform>
        );
    }
    function RenderComments({comments, postComment, dishId}){
        if(comments!=null){
            return(
                <div className="col-12 col-md-5 m-1">
                    <h4>Comments</h4>
                    <List type="unstyled">
                        <Stagger in>
                            {comments.map((comment) => {
                                return (
                                    <Fade in>
                                        <li key={comment.id}>
                                        <p>{comment.comment}</p>
                                        <p>-- {comment.author} , {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}</p>
                                        </li>
                                    </Fade>
                                );
                            })}
                        </Stagger>
                    </List>
                    <ComponentForm dishId={dishId} postComment={postComment} />
                </div>
            );
        }
        else{
            <div></div>
        }
    }
    const DishDetail= (props) => {
        if (props.isLoading) {
            return(
                <div className="container">
                    <div className="row">            
                        <Loading />
                    </div>
                </div>
            );
        }
        else if (props.errMess) {
            return(
                <div className="container">
                    <div className="row">            
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            );
        }
        else if(props.dish!=null){          
            return (  
                <div class="container">
                    <div className="row">
                        <Breadcrumb>
                            <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                            <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                        </Breadcrumb>
                        <div className="col-12">
                            <h3>{props.dish.name}</h3>
                            <hr />
                        </div>                
                    </div>
                    <div className="row">
                        <div className="col-12 col-md-5 m-1">
                            <RenderDish dish={props.dish} />
                        </div>
                        <RenderComments comments={props.comments} 
                            postComment={props.postComment}
                            dishId={props.dish.id}/>
                    </div>
                </div>
            );
        }
        else{
            return(
                <div></div>
            );
        }  
    }
 
export default DishDetail;