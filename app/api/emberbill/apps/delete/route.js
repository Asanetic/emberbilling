
import { mosySqlDelete , base64Decode , mosyQddata , mosyDeleteFile } from '../../../apiUtils/dataControl/dataUtils';

import { DeleteApplications } from '../applications/ApplicationsDbGateway';

export async function GET(request) {

  const { searchParams } = new URL(request.url);

  const deleteToken = searchParams.get('_app_list_delete_record');
  const deleteTokenDecode = base64Decode(deleteToken);

  if (deleteToken) {
    // 👇 Customize table and WHERE clause here
    const table = 'app_list'; // Replace with your actual table
    
     
          
          const deleteAttachedMedia = await mosyQddata('app_list', 'primkey', deleteTokenDecode);
          
          const fileToDelete = deleteAttachedMedia?.logo
         
          mosyDeleteFile(fileToDelete);
    
    const whereStr = `WHERE primkey = '${deleteTokenDecode}'`;

    const res = await DeleteApplications(deleteTokenDecode, whereStr);

    if (res.status === 'success') {
      return Response.json({ status: 'success', rowsAffected: res.affectedRows });
    } else {
      return Response.json({ status: 'error', message: res.message }, { status: 500 });
    }
  }

  return Response.json({ status: 'idle', message: 'No action performed' });
  
}