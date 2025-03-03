import Layout from 'components/Layout';
import FloatingButton from 'components/floatingbutton/FloatingButton';
import PageTitle from 'components/PageTitle';
import LoadMarket from 'components/LoadMarket';
import { FiPlus, FiBriefcase } from 'react-icons/fi';

const Market = () => {
  return (
    <div className='middle-wrap pe-sm-3'>
      <FloatingButton icon={<FiPlus />} href={`/post/create?is_mint=true`} />
      <FloatingButton icon={<FiBriefcase />} href={`/assets`} index={1} />
      <PageTitle title={'Market'} />
      <LoadMarket />
    </div>
  );
};

Market.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default Market;
