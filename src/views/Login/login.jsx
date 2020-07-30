import * as React from 'react';
// import Icon from '@material-ui/core/Icon';
// import TwitterIcon from '@material-ui/icons/Twitter';
// import FacebookIcon from '@material-ui/icons/Facebook';
// import LinkedInIcon from '@material-ui/icons/LinkedIn';
import {   inject} from "mobx-react";
import Logo from '../../assets/img/logo-gop.png'
import { bounceIn } from 'react-animations';
import Radium, {StyleRoot} from 'radium';
import SweetAlert from "react-bootstrap-sweetalert";

const styles = {
  bounceIn: {
    animation: 'x 2s',
    animationName: Radium.keyframes(bounceIn, 'bounceIn')
  }
}
@inject('users')
  class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
            classSelected: 'icon-email-noselected',
            classPassSelected: 'icon-email-noselected',
            email: '',
            password:'',
            animate:false,
            alert: null,
            responseAlert: false,
        };
    }

    

    async componentDidMount(){
        this.setBackgroundColor();
    }
  


    setBackgroundColor(){
      document.getElementById("body").className = " background"
      document.getElementById("html").className = " background"
  
    }



    setValue(e){
      let value = e.target.value;
      this.setState({
        [e.target.name]: value
      })
    }
  
    hideAlert(repsonse) {
      this.setState({
        alert: null,
        responseAlert: repsonse
      });
    }

    successDelete(title,subtitle,type) {
      this.setState({
        alert: (
          <SweetAlert
            error={type==='error'}
            success={type ==='sucess'}
            style={{ display: "block", marginTop: "-100px" }}
            title={title}
            onConfirm={() => this.hideAlert(false)}
            onCancel={() => this.hideAlert(false)}
            confirmBtnBsStyle={type}
          >
           {subtitle}
          </SweetAlert>
        ),
        responseAlert: true
      });
    }

    alertLoading(title,option) {
      this.setState({
        alert: (
          <SweetAlert
            style={{ display: "block", marginTop: "-100px" }}
            title={title}
            showConfirm={false}
          >
           <center><i className="fa fa-spin fa-circle-o-notch" style={{fontSize:20}}/></center>
          </SweetAlert>
          
        )
      });
     !option&&this.hideAlert()
    }

    async login(){
      const {users} = this.props
      this.alertLoading("Espere un momento....",true)
      const result = await users.loginServices({email:this.state.email,password:this.state.password})
      if(result.access_token){
          localStorage.setItem("token-gop",result.access_token)
          localStorage.setItem("name-gop",result.user_data.full_name)
          localStorage.setItem("user-id-gop",result.user_data.id)
          window.location.href = '/admin/dashboard'
          this.alertLoading("Espere un momento....",false)
      }else{
          this.successDelete(result.error,"Favor de verificar los datos","error");
      }
      

    }
    render() {
        return (
            <div className="bk-color-login">
            {this.state.alert}
            <StyleRoot>
            <img src={Logo} alt="Logo empresarial" className="logo-gop" width="250" />
              <div className="card-login">
                <div className="img-login">
                <i className="pe-7s-user icon-card"></i>
                <div className="form-login">
                <div className="email-input">
                
                {/* <Icon  className="icon-email">email</Icon> */}
                <i  className={"fa fa-envelope "+this.state.classSelected +(this.state.email?' icon-email': '')}></i>
                <input 
                type="email" 
                className={this.state.email?' select-input': ' input-login'} 
                onFocus={()=>this.setState({classSelected:'icon-email',animate:true})} 
                onBlur={()=>this.setState({classSelected:'icon-email-noselected',animate:false})} 
                onChange={(e)=>this.setValue(e)}
                value={this.state.email}
                name="email"
                placeholder="Digite su Correo"

                />
                </div>
                <br/><br/><br/>
                <div className="email-input">
                {/* <Icon  className="icon-email">lock</Icon> */}
                <i className={"fa fa-lock "+this.state.classPassSelected +(this.state.password?' icon-email': '')}></i>
                <input 
                type="password" 
                className={this.state.password?' select-input': ' input-login'} 
                name="password"
                
                placeholder="Digite su Contraseña" 
                onFocus={()=>this.setState({classPassSelected:'icon-email'})} 
                onBlur={()=>this.setState({classPassSelected:'icon-email-noselected'})}
                value={this.state.password}
                onChange={(e)=>this.setValue(e)}
                />
                </div>
                  <br/><br/><br/>
                  <div className="btn-container-login">
                    <button disabled={(!this.state.email&&!this.state.password)} className={(this.state.email&&this.state.password)?'btn-login':'btn-login-disabled'} onClick={()=>this.login()}> ENTRAR</button>
                  </div>

                  {/* <div className="btn-container-social">
                    <button className="btn-social"> <TwitterIcon/></button>
                    <button className="btn-social"> <FacebookIcon/></button>
                    <button className="btn-social"> <LinkedInIcon/></button>
                  </div> */}
                </div>
                </div>
              </div>

              <div className="svg-login">
                <svg className="svg" id="f6c00235-76cc-41ae-84b2-bfc054d83f77" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="400" height="613.91263" viewBox="0 0 888 613.91263"><title>active_options</title><path d="M275.323,585.88462l-11.41944-18.452a273.13431,273.13431,0,0,1,12.6615-28.06228l7.49735,6.309-5.84681-9.44746c5.97881-11.20478,10.64756-18.24624,10.64756-18.24624s22.88762,37.7244,29.99091,77.32119l-15.59472,23.06949,17.01541-13.18641a110.50312,110.50312,0,0,1,.63974,13.87219c-.94012,46.70757-16.95677,84.2645-35.77423,83.88574s-33.30986-38.54976-32.36974-85.25733c.29145-14.4798,3.87216-29.56293,8.673-43.48536Z" transform="translate(-156 -143.04369)" fill="#e6e6e6"/><path d="M223.65017,606.48327l-19.31345-9.893a273.13311,273.13311,0,0,1-3.66662-30.56732l9.67919,1.52538-9.88853-5.06522c-.67364-12.68225-.31672-21.12335-.31672-21.12335s39.09262,20.46315,65.641,50.68808l-1.42513,27.80946,7.74988-20.08346a110.50062,110.50062,0,0,1,7.7182,11.54454c23.33842,40.46973,29.04068,80.89917,12.73631,90.30171s-48.44116-15.78241-71.77958-56.25214c-7.23514-12.546-11.96638-27.30873-15.05315-41.70852Z" transform="translate(-156 -143.04369)" fill="#e6e6e6"/><path d="M320.62561,755.851c-22.25416,1.42351-46.50238-.08279-72.29843,0V696.79035c22.73062,3.53858,46.97076,3.17518,72.29843,0Z" transform="translate(-156 -143.04369)" fill="#e6e6e6"/><polygon points="689.193 342.668 453.019 380.696 452.018 151.095 688.192 0 689.193 342.668" fill="#e6e6e6"/><polygon points="667.176 308.643 463.026 352.675 463.026 160.534 667.176 49.73 667.176 308.643" fill="#fff"/><polygon points="647.162 132.514 475.035 209.595 475.035 182.55 647.162 97.517 647.162 132.514" fill="#3f3d56"/><polygon points="647.162 204.567 475.035 265.277 475.035 238.592 647.162 170.035 647.162 204.567" fill="#0d47a1"/><path d="M697.53648,314.17556a.645.645,0,0,1,1.24118-.04088l2.7869,8.78335,3.33872,10.52249a.645.645,0,0,1-.36673.7905l-6.4521,2.68854-5.67052,2.36286a.645.645,0,0,1-.87445-.74964l3.10159-12.59732Z" transform="translate(-156 -143.04369)" fill="#e6e6e6"/><path d="M687.18454,379.667a1.06452,1.06452,0,0,1,2.04832-.06745l2.33611,7.36258,3.22251,10.15622a1.06454,1.06454,0,0,1-.60522,1.30458l-6.0974,2.54073-4.9031,2.04308a1.06452,1.06452,0,0,1-1.44311-1.23712l2.90283-11.79Z" transform="translate(-156 -143.04369)" fill="#e6e6e6"/><polygon points="647.162 276.62 475.035 320.959 475.035 292.631 647.162 239.964 647.162 276.62" fill="#f2f2f2"/><path d="M799.15869,295.02551c0,6.027-2.70015,12.01954-6.00441,13.37389-3.27531,1.3425-5.90948-2.38638-5.90948-8.31806s2.63417-11.89626,5.90948-13.33362C796.45854,285.29766,799.15869,288.99854,799.15869,295.02551Z" transform="translate(-156 -143.04369)" fill="#3f3d56"/><path d="M795.15575,296.72421c0,2.009-.89741,4.01407-2.00147,4.47724-1.10081.4618-1.99081-.78477-1.99081-2.78306s.89-4.00023,1.99081-4.47271C794.25834,293.4718,795.15575,294.71522,795.15575,296.72421Z" transform="translate(-156 -143.04369)" fill="#fff"/><path d="M799.15869,365.077c0,6.027-2.70015,12.01954-6.00441,13.3739-3.27531,1.34249-5.90948-2.38639-5.90948-8.31807s2.63417-11.89626,5.90948-13.33361C796.45854,355.34912,799.15869,359.05,799.15869,365.077Z" transform="translate(-156 -143.04369)" fill="#0d47a1"/><path d="M795.15575,366.77567c0,2.009-.89741,4.01407-2.00147,4.47723-1.10081.46181-1.99081-.78476-1.99081-2.78305s.89-4.00023,1.99081-4.47272C794.25834,363.52325,795.15575,364.76668,795.15575,366.77567Z" transform="translate(-156 -143.04369)" fill="#fff"/><path d="M799.15869,435.12842c0,6.027-2.70015,12.01954-6.00441,13.3739-3.27531,1.34249-5.90948-2.38639-5.90948-8.31807s2.63417-11.89626,5.90948-13.33362C796.45854,425.40057,799.15869,429.10145,799.15869,435.12842Z" transform="translate(-156 -143.04369)" fill="#f2f2f2"/><path d="M795.15575,436.82712c0,2.009-.89741,4.01408-2.00147,4.47724-1.10081.4618-1.99081-.78477-1.99081-2.78306s.89-4.00023,1.99081-4.47271C794.25834,433.57471,795.15575,434.81813,795.15575,436.82712Z" transform="translate(-156 -143.04369)" fill="#fff"/><path d="M703.18454,437.71258a1.06452,1.06452,0,0,1,2.04832-.06746l2.33611,7.36259,3.22251,10.15622a1.06452,1.06452,0,0,1-.60522,1.30457l-6.0974,2.54074-4.9031,2.04308a1.06453,1.06453,0,0,1-1.44311-1.23713l2.90283-11.79Z" transform="translate(-156 -143.04369)" fill="#e6e6e6"/><path d="M662.558,425.39934l9.31146-8.58908s21.077-14.51772,13.71488-22.499-22.20075,10.6303-22.20075,10.6303l-9.20827,6.03186Z" transform="translate(-156 -143.04369)" fill="#a0616a"/><path d="M539.45024,429.39608l-5.424,7.46526s-7.57983,29.15,30.77846,30.698c0,0,48.98859,23.74873,61.11527,8.86981s45.5883-50.66863,45.5883-50.66863L651.82447,405.7558l-40.11266,41.92475-38.91452-19.50011S552.75233,417.126,539.45024,429.39608Z" transform="translate(-156 -143.04369)" fill="#2f2e41"/><polygon points="357.923 424.679 307.135 611.796 313.533 613.076 366.88 424.679 357.923 424.679" fill="#e6e6e6"/><polygon points="419.494 424.679 470.281 611.796 463.883 613.076 410.536 424.679 419.494 424.679" fill="#e6e6e6"/><polygon points="384.795 420.84 393.312 612.109 400.708 612.438 391.194 418.28 384.795 420.84" fill="#e6e6e6"/><path d="M564.469,560.85732c0,4.85147-13.28064,10.05931-30.71161,11.73268-18.70837,1.796-34.91149-1.11922-34.91149-6.63414s16.20312-10.94793,34.91149-12.059C551.18834,552.86167,564.469,556.00585,564.469,560.85732Z" transform="translate(-156 -143.04369)" fill="#e6e6e6"/><path d="M583.02391,528.05305l12.7965,8.95755s55.025,39.66917,49.90637,55.025-33.27091,76.779-33.27091,76.779l-35.83021-11.51686,40.94881-65.26217-21.75406-20.47441-11.51685-28.15231Z" transform="translate(-156 -143.04369)" fill="#2f2e41"/><path d="M533.11754,505.01934s-25.593,39.66917-10.2372,51.186S581.74426,612.51,581.74426,612.51l8.95755,20.47441,31.99126,103.65168,39.66917-20.47441-35.83022-80.618s-3.83895-29.432-16.63545-46.06742-17.91511-40.94881-17.91511-40.94881l3.839-11.51686-22.91252-36.66148Z" transform="translate(-156 -143.04369)" fill="#2f2e41"/><path d="M602.7082,661.48181l-23-7s-24.8366-1.023-23.557,7.93454,21.75406,67.82147,28.15231,63.98252,1.27965-21.75406,1.27965-21.75406Z" transform="translate(-156 -143.04369)" fill="#2f2e41"/><polygon points="395.672 237.21 382.876 251.286 403.35 284.557 412.308 258.964 395.672 237.21" fill="#a0616a"/><path d="M563.82915,429.52l-22.72826-37.63781-7.98335,1.80759v12.79651l-2.5593,107.49063,42.22847-6.39825S575.346,438.47752,563.82915,429.52Z" transform="translate(-156 -143.04369)" fill="#0d47a1"/><path d="M552.3123,428.24032l-19.19476-34.55057-16.63545,7.67791-29.432,120.28714L469.135,556.20536s58.86392,29.432,72.94007,0,15.35581-94.69413,15.35581-94.69413Z" transform="translate(-156 -143.04369)" fill="#2f2e41"/><path d="M524.16,406.48626l-7.6779-5.1186s-29.432-6.39826-29.432,31.99126c0,0-21.75406,49.90636-6.39826,61.42322s52.46567,43.50811,52.46567,43.50811l19.19476-20.4744-43.50812-38.38952,17.91511-39.66916S536.95649,419.28276,524.16,406.48626Z" transform="translate(-156 -143.04369)" fill="#2f2e41"/><path d="M533.11754,529.3327l8.95755,8.95755s15.35581,20.47441,23.03371,12.79651S553.592,529.3327,553.592,529.3327l-6.39825-8.95755Z" transform="translate(-156 -143.04369)" fill="#a0616a"/><path d="M562.34557,417.90711l21.958,53.84132s8.95755,26.87266,8.95755,37.10986V537.0106l-24.31336-31.99126S555.74338,421.65007,562.34557,417.90711Z" transform="translate(-156 -143.04369)" fill="#2f2e41"/><path d="M632.25769,726.43065s-6.3392,24.96005,1.98081,27.07312,78.129,3.9007,78.17309-7.897S667.105,724.06249,667.105,724.06249L650.35052,713.3124Z" transform="translate(-156 -143.04369)" fill="#2f2e41"/><circle cx="411.6681" cy="237.84956" r="23.03371" fill="#a0616a"/><path d="M592.22968,376.75744s4.49919-19.49652,0-23.99572v2.99947s-2.99947-10.49813-8.9984-7.49866c0,0-7.49866-5.99892-8.99841-2.99947-8.82431-7.978-47.95252-.49854-28.95865,41.38862,0,0,3.46322-12.89371,3.46322-8.39451,0,0,8.9984-8.99839,10.49813-11.99786S586.23075,382.75637,592.22968,376.75744Z" transform="translate(-156 -143.04369)" fill="#2f2e41"/><rect y="611.67191" width="888" height="2.24072" fill="#3f3d56"/></svg>


                <svg className="svg2" id="b2116cd0-2da1-48af-94b5-a822b49d01d7" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="400" height="613.91263" viewBox="0 0 875.27408 670"><title>Business_analytics</title><rect x="121.52962" y="92.00012" width="2" height="166.89014" fill="#f2f2f2"/><rect x="188.52962" y="92.00012" width="2" height="166.89014" fill="#f2f2f2"/><path d="M848,138" transform="translate(-162.36296 -115.10974)" fill="#3f3d56"/><path d="M1027.74031,449.65894c24.03393,138.01834,9.38346,273.758-101.10782,320.03988S682.267,747.73176,627.616,617.26051,680.85147,417.544,728.72381,297.22063C825.93828,52.87988,953.1035,21.046,1027.74031,449.65894Z" transform="translate(-162.36296 -115.10974)" fill="#f2f2f2"/><circle cx="773.76363" cy="560.97034" r="6.53537" fill="#ff6584"/><line x1="805.78241" y1="669.44286" x2="805.78241" y2="595.03148" fill="#3f3d56"/><rect x="804.78255" y="595.03186" width="2" height="74.41113" fill="#3f3d56"/><circle cx="805.78241" cy="595.03148" r="10.52282" fill="#3f3d56"/><path d="M968.14538,756.00249s-1.50326-32.33193-32.3201-28.57378" transform="translate(-162.36296 -115.10974)" fill="#3f3d56"/><rect x="36.99983" y="91.00012" width="302" height="2" fill="#f2f2f2"/><rect x="36.99983" y="184.00012" width="302" height="2" fill="#f2f2f2"/><rect x="36.99983" y="258.00012" width="302" height="2" fill="#f2f2f2"/><rect x="57.49983" y="348.49964" width="269" height="2" fill="#3f3d56"/><path d="M204.36279,481.10938a17,17,0,1,1,17-17A17.019,17.019,0,0,1,204.36279,481.10938Zm0-32a15,15,0,1,0,15,15A15.01672,15.01672,0,0,0,204.36279,449.10937Z" transform="translate(-162.36296 -115.10974)" fill="#3f3d56"/><rect x="121.55891" y="259.00012" width="2" height="89.99951" fill="#3f3d56"/><rect x="188.55891" y="185.00012" width="2" height="163.99951" fill="#3f3d56"/><rect x="256.55891" y="92.00012" width="2" height="256.99951" fill="#3f3d56"/><circle cx="122.52941" cy="349" r="14.58824" fill="#0d47a1"/><circle cx="190" cy="349" r="14.58824" fill="#0d47a1"/><circle cx="257.47059" cy="349" r="14.58824" fill="#0d47a1"/><circle cx="258" cy="92" r="14" fill="#0d47a1"/><circle cx="257.63704" cy="184.89026" r="14" fill="#0d47a1"/><circle cx="190" cy="185" r="14" fill="#0d47a1"/><circle cx="189.63704" cy="258.89026" r="14" fill="#0d47a1"/><circle cx="123" cy="259" r="14" fill="#0d47a1"/><circle cx="13" cy="92" r="13" fill="#f2f2f2"/><circle cx="13" cy="184" r="13" fill="#f2f2f2"/><circle cx="13" cy="259" r="13" fill="#f2f2f2"/><rect x="13" width="70" height="6.54545" fill="#3f3d56"/><rect x="13" y="14.72727" width="70" height="6.54545" fill="#3f3d56"/><rect x="13" y="29.45455" width="70" height="6.54545" fill="#3f3d56"/><path d="M799.92577,215.14064s18.90356,24.22018,16.54062,41.35153S855.455,232.86273,855.455,232.86273s-14.17767-29.53681-6.4981-43.71448S799.92577,215.14064,799.92577,215.14064Z" transform="translate(-162.36296 -115.10974)" fill="#ffb9b9"/><path d="M866.08822,705.45164s24.81092,27.17387,20.67577,33.08123-76.7957,28.35533-85.066,27.17386-12.40546-7.08883-9.45178-8.861S814.10344,745.031,814.10344,745.031l15.94988-18.31282s11.81472-6.4981,11.81472-10.04252S866.08822,705.45164,866.08822,705.45164Z" transform="translate(-162.36296 -115.10974)" fill="#2f2e41"/><path d="M824.146,735.57919s-9.45178,15.35914-11.224,15.94987,8.861,21.85724,8.861,21.85724l24.81092-7.67957,13.58693-11.224-2.95368-15.35914Z" transform="translate(-162.36296 -115.10974)" fill="#ffb9b9"/><path d="M798.7443,442.57406l-11.81472,52.57552s-40.7608,91.5641-12.40546,107.514l62.02729,118.738,33.08123-14.7684-55.5292-121.69165L839.5051,444.937Z" transform="translate(-162.36296 -115.10974)" fill="#d0cde1"/><path d="M798.7443,442.57406l-11.81472,52.57552s-40.7608,91.5641-12.40546,107.514l62.02729,118.738,33.08123-14.7684-55.5292-121.69165L839.5051,444.937Z" transform="translate(-162.36296 -115.10974)" opacity="0.1"/><path d="M802.87945,450.84436h-5.99364a333.9813,333.9813,0,0,0,3.04,54.34773c4.13516,30.12754,14.76841,99.24367,14.76841,99.24367s-1.18148,12.9962,2.36294,17.13135,4.13515-1.18147,4.72589,8.27031,6.20273,75.167,6.20273,75.167,3.83979,13.44347-.29537,16.39715-12.40546,18.90356-6.4981,21.2665,46.66816,5.31663,48.44037,3.54442,0-112.83061,0-112.83061-1.18147-22.448-2.363-23.62944-6.49809-17.13135-4.72588-20.67577.59073-14.17766.59073-15.94987-5.31662,0-.59073-7.67957,5.31662-69.11613,5.31662-69.11613,25.40165-38.98859,17.72208-49.0311Z" transform="translate(-162.36296 -115.10974)" fill="#d0cde1"/><circle cx="654.10342" cy="69.90336" r="38.98859" fill="#ffb9b9"/><path d="M855.455,226.36463s-23.62944,5.90736-33.08122,20.085l-8.27031,1.77221v8.2703s-15.35914,49.0311-11.81472,70.2976,0,62.618-5.90736,73.842-7.67957,13.58693-4.72589,18.31282,7.08883,20.67577,4.13515,27.7646,0,14.17767,27.17386,15.94988,65.57172,1.77221,65.57172-7.67957-2.36295-36.03491,0-43.12374,3.54441-11.81472,2.36294-18.31282,2.36294-79.15865,2.36294-79.15865S893.85282,241.72377,855.455,226.36463Z" transform="translate(-162.36296 -115.10974)" fill="#2f2e41"/><path d="M799.92577,408.9021l-32.49048,48.44036s-34.2627,31.309-21.85724,45.48669S790.474,461.47761,790.474,461.47761l35.44417-40.17005Z" transform="translate(-162.36296 -115.10974)" fill="#ffb9b9"/><path d="M820.60154,754.48274s-1.18147-7.67957-5.31663-7.67957-31.89975,18.90356-31.89975,18.90356-38.11476,16.39722-22.0222,17.403c16,1,100.59011,3.27276,101.18085.31908s1.7722-32.08116-2.36295-31.99046-37.21638,6.5888-37.21638,6.5888Z" transform="translate(-162.36296 -115.10974)" fill="#2f2e41"/><path d="M819.23982,164.87063a9.77911,9.77911,0,0,1-4.45606,1.00684c-1.5935.09057-3.49555-.008-4.343-1.36045a6.221,6.221,0,0,1-.54225-2.837,9.34634,9.34634,0,0,0-10.92238-7.96043,13.44458,13.44458,0,0,0,1.74051,5.54339,11.85549,11.85549,0,0,1-10.42222-1.38722l-.60006,7.95737c-2.1192,1.01275-4.834,1.224-6.68211-.2255s-1.99585-4.85139.09446-5.9225c-2.582-.5384-5.73992-1.69522-5.92989-4.32593-.17333-2.40039,2.37513-4.15727,2.84437-6.51772.38272-1.92518-.6727-4.01767.07418-5.83287.98118-2.38464,4.54366-2.99682,5.25838-5.4744.364-1.26178-.15974-2.61143-.03473-3.91869.32734-3.42283,4.63049-4.84393,8.06342-4.64939s7.17972,1.10618,10.09615-.71518c1.41406-.88312,2.40168-2.29662,3.64422-3.40818a10.82275,10.82275,0,0,1,12.568-1.09287c1.38063.85856,2.58527,2.04834,4.12505,2.57019,3.151,1.06792,6.43846-.9527,9.73277-1.41849a8.08617,8.08617,0,0,1,6.7789,1.96366,5.54922,5.54922,0,0,1,1.01,6.686c1.93273-.32645,3.98079-.64221,5.80231.08174s3.21334,2.905,2.37065,4.67472a6.05606,6.05606,0,0,0-.735,1.50119c-.171,1.02961.82049,1.90987,1.82157,2.20511s2.08761.24,3.06773.59872c4.04919,1.48193,3.07759,7.95527,6.2646,10.85958a25.41622,25.41622,0,0,0,3.45482,2.11281,8.40618,8.40618,0,0,1,2.96417,10.15561c-.63881,1.41464-1.70919,2.76467-1.58024,4.3115.18086,2.1695,2.50546,3.35783,4.13683,4.79939a9.62473,9.62473,0,0,1,2.24041,11.05039c-1.49957,3.12814-4.74717,5.49944-5.07685,8.95275-.1433,1.50108.30776,2.99971.28208,4.5074a9.287,9.287,0,0,1-3.99193,7.01155,20.76457,20.76457,0,0,1-7.663,3.18852c-1.28776.30824-2.82439.79081-3.13606,2.07775-.36952,1.52585,1.33294,2.91435,1.15677,4.47439a2.59459,2.59459,0,0,1-1.0418,1.68634c-2.30448,1.80225-5.95147.25721-7.3606-2.30659s-1.22905-5.67066-1.01053-8.588l.79457-10.60829c.24724-3.30078.22352-7.22049-2.46726-9.14818-2.97476-2.13114-7.30715-.40582-10.67124-1.84592-3.50523-1.50052-4.76265-5.892-4.62122-9.70232s1.23314-7.62654.60545-11.38805c-.77818-4.66122-4.92422-7.794-9.11051-4.77343C821.5124,158.93873,822.14766,163.16126,819.23982,164.87063Z" transform="translate(-162.36296 -115.10974)" fill="#2f2e41"/><path d="M851.91055,254.72s-23.62944,9.45178-23.62944,29.53681,1.18147,46.66816-2.95368,55.5292-7.67957,11.81472-5.31663,18.90355,6.4981,5.90737,0,11.224-5.90736-3.54442-6.4981,5.31663,5.90737,10.04251,0,14.17766-21.2665,20.67577-14.7684,25.9924,23.62945,22.448,29.53681,15.94987,8.861-23.03871,17.13135-21.85724,9.45178,1.77221,8.2703-4.13515-6.49809-5.90736.59074-7.67957,10.04251,2.363,7.67957-3.54442-4.13515-8.2703.59074-14.7684,7.08883-8.27031,6.49809-14.7684,12.9962-64.981,12.9962-64.981S886.17325,249.99407,851.91055,254.72Z" transform="translate(-162.36296 -115.10974)" opacity="0.1"/><path d="M845.41246,253.53849S821.783,262.99027,821.783,283.0753s1.18147,46.66815-2.95368,55.5292-7.67957,11.81472-5.31663,18.90355,6.4981,5.90736,0,11.224-5.90736-3.54442-6.49809,5.31662,5.90736,10.04252,0,14.17767-21.2665,20.67577-14.76841,25.99239,23.62945,22.448,29.53681,15.94988,8.861-23.03871,17.13135-21.85724,9.45178,1.77221,8.27031-4.13515-6.4981-5.90736.59073-7.67957,10.04252,2.36294,7.67957-3.54442-4.13515-8.2703.59074-14.7684,7.08883-8.27031,6.4981-14.76841,12.99619-64.981,12.99619-64.981S879.67515,248.8126,845.41246,253.53849Z" transform="translate(-162.36296 -115.10974)" opacity="0.1"/><path d="M848.36614,251.76628s-23.62945,9.45178-23.62945,29.53681,1.18147,46.66816-2.95368,55.5292-7.67957,11.81472-5.31662,18.90355,6.49809,5.90737,0,11.224-5.90737-3.54442-6.4981,5.31663,5.90736,10.04251,0,14.17766-21.2665,20.67577-14.76841,25.99239,23.62945,22.448,29.53681,15.94988,8.861-23.03871,17.13135-21.85724,9.45178,1.77221,8.27031-4.13515-6.4981-5.90736.59073-7.67957,10.04252,2.36294,7.67957-3.54442-4.13515-8.2703.59074-14.7684,7.08883-8.27031,6.4981-14.7684,12.99619-64.981,12.99619-64.981S882.62883,247.04039,848.36614,251.76628Z" transform="translate(-162.36296 -115.10974)" fill="#2f2e41"/><line x1="816" y1="669" x2="276" y2="669" fill="none" stroke="#3f3d56" stroke-miterlimit="10" stroke-width="2"/><rect x="297" y="478" width="70" height="6.54545" fill="#3f3d56"/><rect x="297" y="492.72727" width="70" height="6.54545" fill="#3f3d56"/><rect x="297" y="507.45455" width="70" height="6.54545" fill="#3f3d56"/><path d="M568.896,784.57813a96.86862,96.86862,0,0,1-83.40967-47.98243l-.50537-.86718,83.16357-47.94629v-96.1377l1.00244.00293a96.4655,96.4655,0,0,1-.251,192.93067Zm-81.1709-48.12305a94.47059,94.47059,0,1,0,82.41943-142.79981v95.28321l-.50049.28808Z" transform="translate(-162.36296 -115.10974)" fill="#2f2e41"/><circle cx="406.53299" cy="573.0016" r="36.29735" fill="#0d47a1"/><circle cx="406.53299" cy="573.0016" r="18.10405" fill="#2f2e41"/><rect x="326.63704" y="79.89026" width="24" height="24" fill="#0d47a1"/><rect x="326.63704" y="171.89026" width="24" height="24" fill="#0d47a1"/><rect x="326.63704" y="246.89026" width="24" height="24" fill="#0d47a1"/><path d="M514,477H488V451h26Zm-24-2h22V453H490Z" transform="translate(-162.36296 -115.10974)" fill="#3f3d56"/></svg>              </div>
            </StyleRoot>
            </div>
        )
    }
}

export default Login;


