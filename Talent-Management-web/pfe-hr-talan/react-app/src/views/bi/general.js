// material-ui
//import { Typography } from '@mui/material';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client' ;
import './embed.css';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// ==============================|| SAMPLE PAGE ||============================== //

const Horsprod = () => (
  <MainCard title="Sample Card" >
    <iframe title="final report" width="1100" height="800" src="https://app.powerbi.com/reportEmbed?reportId=699a5f33-8097-4efe-ace2-7645eddefb52&autoAuth=true&ctid=6f07f79b-03b1-44e1-b221-7fa1001b22ac" frameBorder="0" allowFullScreen="true"></iframe>
    <PowerBIEmbed
      
      embedConfig={{
        type: 'report',   // Supported types: report, dashboard, tile, visual, qna, paginated report and create
        id: '054272a5-0a99-4d20-8280-b020925663f0',
        embedUrl:  "https://app.powerbi.com/reportEmbed?reportId=054272a5-0a99-4d20-8280-b020925663f0&groupId=23dcb2d4-8166-4227-92ca-5318b44f3283&w=2&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLU5PUlRILUVVUk9QRS1ILVBSSU1BUlktcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQiLCJlbWJlZEZlYXR1cmVzIjp7InVzYWdlTWV0cmljc1ZOZXh0Ijp0cnVlfX0%3d",
        
        accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkwxS2ZLRklfam5YYndXYzIyeFp4dzFzVUhIMCIsImtpZCI6IkwxS2ZLRklfam5YYndXYzIyeFp4dzFzVUhIMCJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvNmYwN2Y3OWItMDNiMS00NGUxLWIyMjEtN2ZhMTAwMWIyMmFjLyIsImlhdCI6MTcxNjQ5OTc0MCwibmJmIjoxNzE2NDk5NzQwLCJleHAiOjE3MTY1MDM4MTAsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBVlFBcS84V0FBQUFOMTR6UkhJZlBNaGNLbDBSQk81K0dYZE05SWp2Ni8yZ1JwVFc0RUVxclR1bFZZWFRQZ2ZERmIwQWJvaWNyYVVydytwZnNlalJaeGw2a2ZNQnExQWhLSU9wZmVHdjUwdnB2a0VYMFM3cVRETT0iLCJhbXIiOlsicHdkIiwibWZhIl0sImFwcGlkIjoiODcxYzAxMGYtNWU2MS00ZmIxLTgzYWMtOTg2MTBhN2U5MTEwIiwiYXBwaWRhY3IiOiIwIiwiZmFtaWx5X25hbWUiOiJCUkFISU0iLCJnaXZlbl9uYW1lIjoiVEFXRklLIiwiaXBhZGRyIjoiNDEuMjI0LjIxNi45MSIsIm5hbWUiOiJUQVdGSUsgQlJBSElNIiwib2lkIjoiMDFjNGZmYTMtNjAxNi00ZTY3LTlkNDItNDkxMWUwYTg2NDkxIiwicHVpZCI6IjEwMDMyMDAzNEI2NEZBNjYiLCJyaCI6IjAuQVhvQW1fY0hiN0VENFVTeUlYLWhBQnNpckFrQUFBQUFBQUFBd0FBQUFBQUFBQUI2QUlBLiIsInNjcCI6InVzZXJfaW1wZXJzb25hdGlvbiIsInNpZ25pbl9zdGF0ZSI6WyJrbXNpIl0sInN1YiI6IlB1ZnRuZ2puNHNmNDNaNkpaNDEwY1BCdEhyNVZBQk5pcWdLbWwxM2t0cEUiLCJ0aWQiOiI2ZjA3Zjc5Yi0wM2IxLTQ0ZTEtYjIyMS03ZmExMDAxYjIyYWMiLCJ1bmlxdWVfbmFtZSI6InRhd2Zpay5icmFoaW1AdGFsYW4uY29tIiwidXBuIjoidGF3ZmlrLmJyYWhpbUB0YWxhbi5jb20iLCJ1dGkiOiJzUTJidXRBZG9VMkxRYmlJWjR4UEFBIiwidmVyIjoiMS4wIiwid2lkcyI6WyJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXX0.f_TAl6q8NPONBLrHJEDKsLp_XqEZkHOUnVKDjs0ZBBeWC83TwIYL-XW8yYamSNvTz7fFxhUaZ9W8e7ke2hQU9SkV0842oJrVRxJNV6XcI_9a7eifVXXKY1QyQl4nbO0GHmYgZ5tunyaj9JMJSWUgQvQUOs1EtCO0P_nn9HAwGU24GxPgb1VyCugZ67i8L7AbJPOuc3qDldbFbR_b4NWJ0fbJjlpYhnNZIn0XY8G-E6TsHlIEYM3-33TNVehQ91TbwUANZaNqLiJqTsrVRas2vEzkGIBgNSfyfGxnDveJxaoWyNG2-ADs7qJWtl1NIaChHbOAcide00fmXYr93lzWzQ',
        tokenType: models.TokenType.Aad, // Use models.TokenType.Aad or .Embed for AAD tokens or Embed tokens
        settings: {
          panes: {
            filters: {
              expanded: true,
              visible: false
            }
          },
          navContentPaneEnabled: false,
          background: models.BackgroundType.Default,
        }
      }}

      eventHandlers={
        new Map([
          ['loaded', function () { console.log('Report loaded'); }],
          ['rendered', function () { console.log('Report rendered'); }],
          ['error', function (event) { console.log(event.detail); }],
          ['visualClicked', () => console.log('visual clicked')],
          ['pageChanged', (event) => console.log(event)],
        ])
      }

      cssClassName={"Embed"}

      getEmbeddedComponent={(embeddedReport) => {
        window.report = embeddedReport;
      }}
    />
  </MainCard>
);

export default Horsprod;
