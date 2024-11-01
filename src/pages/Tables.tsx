import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import TableOne from '../components/Tables/TableOne';
import TableThree from '../components/Tables/TableThree';
import TableTwo from '../components/Tables/TableTwo';

const Tables = () => {
  return (
    <>
      <Breadcrumb pageName="Approve Reviews" />

      <div className="flex flex-col gap-10">
        {/* <TableOne />*/}  
        <TableThree />
        <TableTwo /> *
      </div>
    </>
  );
};

export default Tables;
