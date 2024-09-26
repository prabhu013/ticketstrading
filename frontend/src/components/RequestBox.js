import React from 'react'
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RequestBox({val}) {

    const navigate = useNavigate();
    const handleCancel = async (e) => {
        e.preventDefault();
        const response = await fetch("https://ticket-trading.onrender.com/check/cancelmyrequest", {
          method: 'Post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({requestdata : val })
        });
    
        const json = await response.json();
    
        if (!json.success)
        {
          toast.error("Something Error, Order Not Cancelled",{position : "top-right"})
        }
        if (json.success) {
          toast.success("Order Cancelled",{position : "top-right"})
          
          setTimeout(()=>{ navigate("/")},1500)
        }
      };
  return (
    <div key={val._id} style={{ backgroundColor:'white',width : '500px', border: '2px solid black', padding: '10px', marginBottom: '20px'}}>
              <div style={{ 
        
        top: '10px', 
       textAlign : 'end', 
        padding: '5px'
       
        
      }}>
       Placed On : <span style={{fontWeight:'bold'}}>{format(new Date(val.updatedAt), 'HH:mm, dd/MM/yy')}</span>
      </div>
           <div style={{ borderBottom: '1px solid black', paddingBottom: '10px' , textAlign:'center'}}>
             <h3>{val.question}</h3>
           </div>
           <div style={{ display: 'flex', marginTop: '10px' }}>
            <div style={{display: 'block',alignItems: 'center',textAlign:'center', marginRight:'20px'}}> 
              <h5>Request :</h5>
            </div>
             <div style={{ width: '150px',display: 'block', alignItems: 'center', textAlign:'center'}}>
              {val.ans === 'Yes' ? 
               <div style={{ backgroundColor: 'green', color: 'white', padding: '5px',alignItems: 'center'}} >{val.ans} at {val.value}</div>
               :
               <div style={{ backgroundColor: 'red', color: 'white', padding: '5px',alignItems: 'center' }} > {val.ans} at {val.value}</div>
            }
            </div>
            <button 
            onClick={handleCancel}
            style={{width:'150px' ,height:'34px',textAlign: 'center',alignItems:'center', padding: '5px', backgroundColor: 'yellow', color: 'black', borderRadius: '5px', cursor: 'pointer',marginLeft:'20px' }}
          >
            Cancel
          </button>
             
           </div>
           </div> 
            )
}
